<template>
  <div class="the-lyrics-wrapper">
    <div class="the-lyrics"
      :class="{'--static': !animate, '--unsynced': !isSynced, '--override': !scroll}"
      ref="lyrics">
      <template v-if="synced">
        <p
          v-for="(entry, index) in synced"
          :key="index"
          :line="index"
          :class="{ 'active-line': activeLine === index}">
          {{ entry.line }}
        </p>
      </template>
      <template v-else>
        <router-link to="/sync" tag="div">
          <base-button>Help sync lyrics</base-button>
        </router-link>
        <p
          v-for="(line, index) in normal"
          :key="index"
          :line="index"
          :class="{ 'accent-line': !line }">
          {{ line ? line : '● ● ●' }}
        </p>
        <p class="accent-line">
          ( END )
        </p>
      </template>
    </div>
    <div class="scroll-offset-bar" v-if="synced" :style="{'transform': `scaleX(${scrollOffset})`}"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseButton from './BaseButton'
import deviceDelay from '@/mixins/deviceDelay'
import easyScroll from 'easy-scroll'

export default {
  name: 'TheLyrics',
  components: { BaseButton },
  mixins: [ deviceDelay ],
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
      hasFocus: true,
      scrollDebounce: false,
      scrollOffset: 0,
      activeLine: -1,
      timer: null,
      scrollListenerTimer: null,
      scrollTimer: null,
      touchEndTimer: null,
      isScrolling: false,
      fetchDelay: 500,
      scrollDuration: 200,
      scrollThreshold: 150,
      lastUpdatedAt: 0,
      lastProgress: 0,
      lastScrollPos: 0,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      scroll: state => state.lyrics.scroll,
      progress: state => state.playback.progress,
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
      this.setScroll(true)
      if (this.hasSynced && this.loaded) {
        console.log('New lyrics, syncing...')
        this.$nextTick(() => this.sync)
        window.addEventListener('touchend', this.handleTouchend)
      } else {
        window.removeEventListener('touchend', this.handleTouchend)
      }
    },
    updatedAt (newVal, oldVal) {
      this.lastUpdatedAt = oldVal
    },
    progress (newVal, oldVal) {
      this.lastProgress = oldVal
      if (this.hasSynced) {
        const diff = Math.abs((oldVal + this.updatedAt) - (newVal + this.lastUpdatedAt))
        if (diff > 50) this.sync()
      }
    },
    delay () {
      if (this.hasSynced) {
        this.sync()
      }
    },
    scroll (newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.loaded) {
        this.scrollDebounce = true
        setTimeout(() => {
          this.scrollDebounce = false
        }, this.scrollDuration + 100)
        this.move()
      }
    },
  },
  methods: {
    ...mapActions({
      fetchPlayback: 'playback/fetchPlayback',
      setScroll: 'lyrics/setScroll',
    }),
    handleScroll (e) {
      // need to debounce touchend
      clearTimeout(this.scrollTimer)
      this.isScrolling = true
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false
      }, 66)
      if (this.hasFocus && !this.scrollDebounce) {
        const scrollOffset = Math.abs(e.target.scrollTop - this.lastScrollPos)
        this.scrollOffset = Math.min(Math.max(scrollOffset / 15, 0), 10)
        if (scrollOffset > this.scrollThreshold) {
          this.$refs.lyrics.removeEventListener('scroll', this.handleScroll)
          this.setScroll(false)
          this.scrollOffset = 0
          window.navigator.vibrate(10)
        }
      }
    },
    handleBlur () {
      this.hasFocus = false
    },
    handleFocus () {
      setTimeout(() => {
        this.hasFocus = true
      }, this.scrollDuration + 100)
    },
    handleTouchend () {
      clearInterval(this.touchEndTimer)
      if (this.isScrolling) {
        this.touchEndTimer = setInterval(() => {
          if (!this.scroll) {
            clearInterval(this.touchEndTimer)
          } else if (!this.isScrolling) {
            this.move()
            clearInterval(this.touchEndTimer)
          }
        }, 50)
      } else {
        if (this.scroll) this.move()
      }
    },
    computeProgress () {
      return this.progress + (Date.now() - this.updatedAt) + (this.baseDelay + this.delay)
    },
    next () {
      this.activeLine = this.activeLine + 1
      if (this.scroll) this.move()
    },
    move (line = this.activeLine) {
      if (line === -1) return
      const target = this.$refs.lyrics
        .querySelector(`p[line="${line}"]`)
      const height = target.offsetHeight
      const center = this.$refs.lyrics.offsetHeight / 2
      const top = target.getBoundingClientRect().top
      this.$refs.lyrics.removeEventListener('scroll', this.handleScroll)
      this.scrollOffset = 0
      easyScroll({
        scrollableDomEle: this.$refs.lyrics,
        direction: 'bottom',
        easingPreset: 'easeOutCubic',
        duration: this.scrollDuration,
        scrollAmount: top - center + (height / 3),
      })
      this.scrollListenerTimer = setTimeout(() => {
        this.lastScrollPos = this.$refs.lyrics.scrollTop
        this.$refs.lyrics.addEventListener('scroll', this.handleScroll)
      }, this.scrollDuration + 100)
    },
    calculateNext (ms) {
      if (this.activeLine >= this.length) {
        return this.calculateFetch()
      }
      const timer = ms || (this.times[this.activeLine + 1] - this.computeProgress())
      this.timer = setTimeout(this.tick, timer)
    },
    calculateFetch () {
      const timer = this.duration - this.computeProgress() + this.fetchDelay
      this.timer = setTimeout(this.fetchPlayback, timer)
    },
    tick () {
      if (this.hasSynced && this.activeLine < this.length) {
        this.next()
        this.calculateNext()
      }
    },
    clear () {
      clearTimeout(this.scrollListenerTimer)
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    sync () {
      this.clear()

      const progress = this.serverProgress
      let line = this.times.findIndex(time => time > progress)
      line = line === -1
        ? this.length
        : line - 1

      if (line <= this.length) {
        if (line !== this.activeLine) {
          if (line === -1) {
            this.move(0)
          } else {
            this.move(line)
          }
        }
        this.activeLine = line
        if (this.playing) {
          this.calculateNext()
        }
      }
    },
  },
  mounted () {
    this.setScroll(true)
    this.loaded = true
    if (this.hasSynced) {
      this.sync()
      window.addEventListener('touchend', this.handleTouchend)
    }
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)
  },
  beforeDestroy () {
    this.clear()
    this.$refs.lyrics.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)
    window.removeEventListener('touchend', this.handleTouchend)
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics-wrapper {
  height: 100%;
  width: 100%;
}
.scroll-offset-bar {
  height: 6px;
  background: $font-color;
  position: fixed;
  bottom: 0;
  left: calc(50% - 5%);
  width: 10%;
  transition: transform .05s;
  opacity: .9;
}
.the-lyrics {
  height: 100%;
  overflow-y: scroll;
  overflow-x: visible;
  z-index: 0 !important;
  overflow: scroll !important;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-flow: column;
  align-items: center;
  position: relative;
  touch-action: pan-y;
  font-size: 1em;
  text-align: center;
  mask-image: linear-gradient(transparent 70px, black 33%, black 66%, transparent 100%);
  transform: translateZ(0) translate3d(0,0,0);

  .base-button {
    font-size: .5em;
    margin: 1em 0;
    padding: 1.4em 2.6em;
    height: auto;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .15em;

    @media only screen and (min-width: 640px) {
      padding: 1em 2em;
      font-size: .5em;
    }
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
    opacity: .5;
    transition: transform .1s ease-out;
    max-width: 1920px;
    width: 75%;
  }

  &.--override {
    p {
      opacity: .9;
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
    color: $accent-color;
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
