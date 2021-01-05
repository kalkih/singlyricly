<template>
  <div class="the-lyrics-wrapper">
    <div v-longtouch="handleLongTouch" class="the-lyrics" id="lyrics"
      :class="{'--static': !animate, '--unsynced': !isSynced, '--override': !autoSync}"
      ref="lyrics">
      <template v-if="synced">
        <base-lyrics-row class="accent-line" :index="-1" :text="TEXT_INTRO" :position="0" :active="activeLine === -1"/>
        <base-lyrics-row
          v-for="({ line, milliseconds }, index) in synced"
          :key="index"
          :index="index"
          :text="line"
          :active="activeLine === index"
          @click.prevent="handleRowTouch(milliseconds)">
        </base-lyrics-row>
      </template>
      <template v-else>
        <router-link to="/sync" tag="div">
          <base-button>Help sync lyrics</base-button>
        </router-link>
        <base-lyrics-row
          v-for="(line , index) in normal"
          :key="index"
          :index="index"
          :text="line || TEXT_EMPTY"
          :class="{ 'accent-line': !line }"
        />
        <base-lyrics-row :text="TEXT_OUTRO" class="accent-line"/>
      </template>
    </div>
    <the-scroll-override-bar v-if="synced" :offset="scrollOffset" :active="autoSync"/>
    <input ref="copy" type="text"/>
    <the-progress-bar
      v-if="duration && currentProgress"
      ref="progress"
      :progress="currentProgress"
      :duration="duration"
      :hide="!!(scrollOffset || !playing)"
      :updatedAt="updatedAt"
      @seeking="(position) => seekProgress = position"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SweetScroll from 'sweet-scroll'
import deviceDelay from '@/mixins/deviceDelay'
import BaseButton from './BaseButton'
import TheScrollOverrideBar from './TheScrollOverrideBar'
import BaseLyricsRow from './BaseLyricsRow'
import TheProgressBar from './TheProgressBar'

export default {
  name: 'TheLyrics',
  components: { BaseButton, TheScrollOverrideBar, BaseLyricsRow, TheProgressBar },
  mixins: [deviceDelay],
  props: {
    animate: {
      type: Boolean,
      default: true,
    },
    isSynced: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      loaded: false,
      scroller: null,
      hasFocus: true,
      activeLine: -2,
      timer: null,
      scrollTimer: null,
      touchEndTimer: null,
      scrollOffset: 0,
      isScrolling: false,
      isTouching: false,
      lastUpdatedAt: 0,
      lastProgress: 0,
      lastScrollPos: 0,
      FETCH_DELAY: 500,
      SCROLL_DURATION: 200,
      SCROLL_THRES: 150,
      currentProgress: 0,
      seekProgress: 0,
      TEXT_INTRO: '[ INTRO ]',
      TEXT_OUTRO: '[ END ]',
      TEXT_EMPTY: '● ● ●',
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      autoSync: state => state.lyrics.scroll,
      progress (state) {
        return this.seekProgress || state.playback.progress
      },
      playing: state => state.playback.playing,
      updatedAt: state => state.playback.updatedAt,
      duration: state => state.playback.track.length,
      delay: state => state.settings.delay,
    }),
    length () {
      return this.synced.length - 1
    },
    hasLyrics () {
      return !!(this.synced || this.normal)
    },
    hasSynced () {
      return !!(this.synced)
    },
    hasNormal () {
      return !!(this.normal)
    },
    times () {
      return this.synced.map(line => Number(line.milliseconds))
    },
    serverProgress () {
      return this.progress + (Date.now() - this.updatedAt) + (this.baseDelay + this.delay)
    },
  },
  watch: {
    synced () {
      this.clear()
      this.setAutoSync(true)
      if (this.hasSynced && this.loaded) {
        console.log('New lyrics, syncing...')
        this.$nextTick(() => this.sync)
        this.$refs.lyrics.addEventListener('touchend', this.handleTouchend)
      } else {
        this.$refs.lyrics.removeEventListener('touchend', this.handleTouchend)
      }
    },
    updatedAt (newVal, oldVal) {
      this.lastUpdatedAt = oldVal
    },
    progress: {
      immediate: true,
      handler (newVal, oldVal) {
        this.lastProgress = oldVal
        this.currentProgress = newVal

        const diff = Math.abs((oldVal + this.updatedAt) - (newVal + this.lastUpdatedAt))
        if (diff > 50) {
          this.$refs.progress && this.$refs.progress.reset(newVal)
          this.hasSynced && this.sync()
        }
      },
    },
    delay () {
      if (this.hasSynced) {
        this.sync()
      }
    },
    autoSync (newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.loaded) {
        this.$refs.lyrics.style.overflow = 'hidden'
        setTimeout(() => {
          this.$refs.lyrics.style.overflow = ''
        }, 10)
        this.move()
      }
    },
  },
  methods: {
    ...mapActions({
      seek: 'playback/seek',
      fetchPlayback: 'playback/fetchPlayback',
      setAutoSync: 'lyrics/setScroll',
    }),
    addScrollListener (setScrollPos = true) {
      this.scrollOffset = 0
      if (this.$refs.lyrics) {
        this.lastScrollPos = this.$refs.lyrics.scrollTop
        this.$refs.lyrics.addEventListener('scroll', this.handleScroll)
      }
    },
    removeScrollListener () {
      this.$refs.lyrics.removeEventListener('scroll', this.handleScroll)
      this.isTouching = false
    },
    beforeAutoScroll () {
      this.removeScrollListener()
    },
    afterAutoScroll () {
      this.addScrollListener()
    },
    initScroller () {
      this.scroller = new SweetScroll({
        duration: this.SCROLL_DURATION,
        easing: 'easeOutCubic',
        before: this.beforeAutoScroll,
        complete: this.afterAutoScroll,
        cancellable: false,
      }, this.$refs.lyrics)
    },
    handleScroll (e) {
      clearTimeout(this.scrollTimer)
      this.isScrolling = true
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false
      }, 66)
      if (this.hasFocus) {
        const scrollOffset = Math.abs(e.target.scrollTop - this.lastScrollPos)
        this.scrollOffset = Math.min(Math.max(scrollOffset / 15, 0), 10)
        if (scrollOffset > this.SCROLL_THRES) {
          this.removeScrollListener()
          this.setAutoSync(false)
          this.scrollOffset = 0
          window.navigator.vibrate && window.navigator.vibrate(10)
        }
      }
    },
    handleRowTouch (position) {
      if (!this.autoSync && position >= 0) {
        this.seek(Number(position))
        this.setAutoSync(true)
      }
    },
    handleLongTouch () {
      if (!this.synced || !this.synced[this.activeLine]) return
      const input = this.$refs.copy
      input.value = this.synced[this.activeLine].line
      input.select()
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      window.navigator.vibrate && window.navigator.vibrate(10)
    },
    handleBlur () {
      this.hasFocus = false
    },
    handleFocus () {
      setTimeout(() => {
        this.hasFocus = true
      }, this.SCROLL_DURATION + 100)
    },
    handleRotate () {
      this.hasFocus = false
      setTimeout(() => {
        if (this.hasSynced) this.move()
        this.hasFocus = true
      }, 50)
    },
    handleTouchStart (e) {
      this.isTouching = true
    },
    handleTouchend (e) {
      this.isTouching = false
      clearInterval(this.touchEndTimer)
      if (this.isScrolling) {
        this.touchEndTimer = setInterval(() => {
          if (!this.autoSync) {
            clearInterval(this.touchEndTimer)
          } else if (!this.isScrolling) {
            this.move()
            clearInterval(this.touchEndTimer)
          }
        }, 50)
      } else {
        if (this.autoSync && this.$refs.lyrics.scrollTop !== this.lastScrollPos) {
          this.move()
        }
      }
    },
    computeProgress () {
      return this.progress + (Date.now() - this.updatedAt) + (this.baseDelay + this.delay)
    },
    next () {
      this.activeLine = this.activeLine + 1
      if (this.autoSync && !this.isTouching) this.move()
    },
    move (line = this.activeLine, duration = this.SCROLL_DURATION) {
      if (line === -2) return
      const target = this.$refs.lyrics
        .querySelector(`p[line="${line}"]`)
      const offset = (this.$refs.lyrics.offsetHeight - target.offsetHeight) / 2
      this.scroller.toElement(target, {
        offset: -offset,
      })
    },
    calculateNext (delay) {
      if (this.activeLine >= this.length) {
        return this.calculateFetch()
      }
      const ms = delay || (this.times[this.activeLine + 1] - this.computeProgress())
      this.timer = setTimeout(this.tick, ms)
    },
    calculateFetch () {
      const ms = this.duration - this.computeProgress() + this.FETCH_DELAY
      this.timer = setTimeout(this.fetchPlayback, ms)
    },
    tick () {
      if (this.hasSynced && this.activeLine < this.length) {
        this.next()
        this.calculateNext()
      }
    },
    clear () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    sync () {
      this.clear()

      const progress = this.serverProgress
      let line = this.times.findIndex(time => time > progress) - 1
      line = line === -2 ? this.length : line

      if (line <= this.length) {
        if (line !== this.activeLine) {
          line === -1 ? this.move(0) : this.move(line)
        }
        this.activeLine = line
        if (this.playing && !this.seekProgress) {
          this.calculateNext()
        }
      }
    },
  },
  mounted () {
    this.setAutoSync(true)
    this.initScroller()
    this.loaded = true
    if (this.hasSynced) {
      this.sync()
      this.$refs.lyrics.addEventListener('touchstart', this.handleTouchStart)
      this.$refs.lyrics.addEventListener('touchend', this.handleTouchend)
    }
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)
    window.addEventListener('orientationchange', this.handleRotate)
  },
  beforeUnmount () {
    this.clear()
    this.removeScrollListener()
    this.$refs.lyrics.removeEventListener('touchend', this.handleTouchend)
    this.$refs.lyrics.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)
    window.removeEventListener('orientationchange', this.handleRotate)
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics-wrapper {
  height: 100%;
  width: 100%;

  input {
    position: fixed;
    left: -9999px;
    z-index: -990;
  }
}
.the-lyrics {
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
  overflow-x: visible;
  z-index: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-flow: column;
  align-items: center;
  position: relative;
  font-size: 1em;
  text-align: center;
  mask-image: linear-gradient(transparent, rgba(0,0,0,.1) 70px, black 25%, black 66%, rgba(0,0,0,.1) calc(100% - 140px), transparent);
  transform: translateZ(0) translate3d(0,0,0);

  p {
    touch-action: pan-y;
  }

  .base-button {
    font-size: .5em;
    margin: 1em 0;
    padding: 1.4em 2.6em;
  }

  &:before {
    content: '';
    padding-top: 40vh;
  }

  &:after {
    content: '';
    padding-top: 50vh;
  }

  &.--unsynced {
    will-change: auto;
    touch-action: pan-y;
    scroll-snap-type: y mandatory;

    &:before {
      content: '';
      padding-top: 25vh;
    }

    p {
      scroll-snap-align: center;
      opacity: 1;

      @media only screen and (min-width: 640px) {
        padding: .4em 0;
      }
    }
  }

  &.--static {
    will-change: auto;

    p {
      display: none;
      opacity: 1;
    }

    .active-line {
      display: block;
      position: absolute;
      top: 50%;
      transform:
        translateY(-50%)
        scale3d(1, 1, 1)
        translateZ(0);
    }
  }

  p {
    opacity: .75;
    transition: transform .1s ease-out;
    max-width: 1920px;
    width: 75%;
  }

  &.--override {
    p {
      opacity: .9;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .active-line {
      opacity: 1;
    }
  }

  .active-line {
    opacity: 1;
    transform: scale3d(1.25, 1.25, 1.25) translateZ(0);
    transition: transform .1s ease-in;
  }

  .accent-line {
    color: var(--theme-color-light);
    opacity: .75;
  }

  @media only screen and (min-width: 640px) {
    padding: 0 1em;
    font-size: calc(1em + 1vw);

    p {
      padding: .4em 0;
      width: 60%;
    }

    .active-line {
      transform: scale3d(1.45, 1.45, 1.45) translateZ(0);
    }
  }

  @media only screen and (max-height: 640px) {
    mask-image: linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%);
    font-size: calc(.75em + 1vw);
    p {
      padding: 0em 0;
    }
  }
}
</style>
