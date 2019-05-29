<template>
  <div class="the-lyrics">
    <transition v-if="hasSynced" appear v-on:appear="lyricsCreated" name="lyrics-trans">
      <div class="the-lyrics__lyrics --synced" :class="{'--static': !animate}" ref="lyrics">
        <p
          v-for="(entry, index) in synced"
          :key="index"
          :line="index"
          :class="{ active: activeLine === index}">
          {{ entry.line }}
        </p>
      </div>
    </transition>
    <transition v-else-if="hasNormal" appear v-on:appear="goToFirstLine" name="lyrics-trans">
      <div class="the-lyrics__lyrics --normal" ref="lyrics">
        <p class="--accent">
          ( UNSYNCED )
        </p>
        <p
          v-for="(line, index) in normal"
          :key="index"
          :line="index"
          :class="{ '--accent': !line }">
          {{ line ? line : '● ● ●' }}
        </p>
        <p class="--accent">
          ( END )
        </p>
      </div>
    </transition>
    <div v-else class="the-lyrics__info">
      <div v-if="!progress" class="not-available">
        <play/>
        <h2>Play something on Spotify and check back here</h2>
      </div>
      <div v-else-if="found">
        <h2>We're getting your lyrics, stay tuned!</h2>
        <div class="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="not-found" v-else>
        <sad/>
        <h2>Sorry but we couldn't find any lyrics for this track</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import sad from '@/assets/sad.svg'
import play from '@/assets/play.svg'
import easyScroll from 'easy-scroll'

export default {
  name: 'TheLyrics',
  components: { sad, play },
  data () {
    return {
      loaded: false,
      activeLine: -1,
      timer: null,
      offset: 0,
      baseDelay: -750,
      animate: true,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      found: state => state.lyrics.found,
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
      return this.synced || this.normal
    },
    hasSynced () {
      return this.synced
    },
    hasNormal () {
      return this.normal
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
      if (this.hasSynced && this.loaded) {
        console.log('new lyrics, syncing...')
        this.$nextTick(() => this.sync())
      }
    },
    progress () {
      if (this.hasSynced) {
        this.sync()
      }
    },
    delay () {
      if (this.hasSynced) {
        this.sync()
      }
    },
  },
  methods: {
    computeProgress () {
      return this.progress + (Date.now() - this.updatedAt) + (this.baseDelay + this.delay)
    },
    next () {
      this.activeLine = this.activeLine + 1
      this.move()
    },
    move (line = this.activeLine) {
      const target = this.$refs.lyrics
        .querySelector(`p[line="${line}"]`)
      const height = target.offsetHeight
      const center = this.$refs.lyrics.offsetHeight / 2
      const top = target.getBoundingClientRect().top
      easyScroll({
        scrollableDomEle: this.$refs.lyrics,
        direction: 'bottom',
        easingPreset: 'easeOutCubic',
        duration: 200,
        scrollAmount: top - this.offset - center + (height / 2),
      })
    },
    calculateNext (ms) {
      const timer = ms || (this.times[this.activeLine + 1] - this.computeProgress())
      this.timer = setTimeout(this.tick, timer)
    },
    tick () {
      if (this.hasSynced && this.activeLine < this.length) {
        this.next()
        this.calculateNext()
      }
    },
    pause () {
      this.clear()
    },
    resume () {
      this.sync()
    },
    clear () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    sync () {
      const progress = this.serverProgress
      this.clear()

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
    lyricsCreated (el, done) {
      this.loaded = true
      this.offset = this.$refs.lyrics.offsetTop
      this.sync()
      done()
    },
    goToFirstLine (el, done) {
      this.offset = this.$refs.lyrics.offsetTop
      this.move(0)
      done()
    },
  },
  destroyed () {
    this.clear()
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics {
  position: relative;
  font-weight: 600;
  width: 100%;
  font-size: 1.8em;
  text-align: center;
  letter-spacing: .015em;
  display: flex;
  align-items: center;
  flex-flow: row;
  height: 100vh;

  // DEBUG CENTER
  // &:before {
  //   content: '';
  //   position: fixed;
  //   top: calc(50% - 2px);
  //   height: 4px;
  //   background: red;
  //   width: 100%;
  //   z-index: 200;
  // }

  &__info {
    width: 100%;
    padding: 1em;

    @media only screen and (min-width: 640px) {
      font-size: calc(1em + 1vw);
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
      animation: fade-in .5s ease-out;
    }

    svg {
      height: 4em;
      fill: $accent-color;
      margin-bottom: 1em;
    }

    h2 {
      font-size: 1em;
      color: $accent-color;
      opacity: .75;
      margin: 0;
    }

    .spinner {
      font-size: .8em;
      margin-top: 3em;
    }
  }

  &__lyrics {
    mask-image: linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%);
    -webkit-mask-image: linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%);

    max-height: calc(100vh - 6em);
    animation: fade-in .5s ease-out;
    overflow-y: scroll;
    overflow-x: visible;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    position: relative;
    touch-action: pan-y;

    &:before {
      content: '';
      padding-top: calc(50vh - 3em);
    }
    &:after {
      content: '';
      padding-top: calc(50vh - 3em);
    }

    &.--synced {
      p {
        opacity: .5;
      }
    }

    &.--static {
      p {
        display: none;

        &.active {
          display: block;
          position: absolute;
          top: 50%;
          transform:
            translateY(-50%)
            scale3d(1.25, 1.25, 1.25);

          @media only screen and (min-width: 640px) {
            transform:
              translateY(-50%)
              scale3d(1.4, 1.4, 1.4);
          }
        }
      }
    }

    p {
      transition: transform .1s ease-out;
      max-width: 75%;
      word-break: break-word;
      margin: 0;
      padding: 1em 0;
      transform: scale3d(1, 1, 1);

      &.--accent {
        color: $accent-color;
        opacity: .75;
      }

      &.active {
        transform: scale3d(1.25, 1.25, 1.25);
        opacity: 1;
        will-change: transform;
        transition: transform .1s ease-in;
      }

      @media only screen and (min-width: 640px) {
        max-width: 60%;
        font-size: calc(1em + 1vw);

        &.active {
          transform: scale3d(1.4, 1.4, 1.4);
        }
      }
    }
  }
  .lyrics-trans-leave-active {
    display: none;
  }
}
</style>
