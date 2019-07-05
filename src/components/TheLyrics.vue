<template>
  <div class="the-lyrics"
    :class="{'--static': !animate, '--unsynced': !isSynced}"
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
        <base-button>Help sync these lyrics</base-button>
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
</template>

<script>
import { mapState } from 'vuex'
import BaseButton from './BaseButton'
import easyScroll from 'easy-scroll'

export default {
  name: 'TheLyrics',
  components: { BaseButton },
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
      activeLine: -1,
      timer: null,
      baseDelay: -750,
      lastUpdatedAt: 0,
      LastProgress: 0,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
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
      if (this.hasSynced && this.loaded) {
        console.log('New lyrics, syncing...')
        this.$nextTick(() => this.sync)
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
        scrollAmount: top - center + (height / 3),
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
    clear () {
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
    this.loaded = true
    if (this.hasSynced) {
      this.sync()
    }
  },
  beforeDestroy () {
    this.clear()
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics {
  height: 100%;
  overflow-y: scroll;
  overflow-x: visible;
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
    padding: 1.2em 2em;
    margin: 1em 0;
    height: auto;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .075em;

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
