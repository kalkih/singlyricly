<template>
  <div class="the-lyrics"
    :class="{'--static': !animate, '--unsynced': !isSynced}"
    ref="lyrics">
    <template v-if="synced">
      <p
        v-for="(entry, index) in synced"
        :key="index"
        :line="index"
        :class="{ active: activeLine === index}">
        {{ entry.line }}
      </p>
    </template>
    <template v-else>
      <router-link to="/sync">
        <base-button>Help sync these lyrics</base-button>
      </router-link>
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
  font-size: 1.25em;
  text-align: center;
  mask-image: linear-gradient(transparent 70px, black 33%, black 66%, transparent 100%);

  @media only screen and (max-height: 640px) {
    mask-image: linear-gradient(transparent 0%, black 25%, black 75%, transparent 100%);
  }

  @media only screen and (min-width: 640px) {
    padding: 0 1em;
    font-size: 1.6em;
  }

  .base-button {
    font-size: .6em;
    padding: .8em 1em;
    margin: 1em 0;
    height: auto;
    font-weight: 600;

    @media only screen and (min-width: 640px) {
      padding: .5em 1em;
      font-size: .6em;
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
    p {
      display: none;
      opacity: 1;

      &.active {
        display: block;
        position: absolute;
        top: 50%;
        transform:
          translateY(-50%)
          scale3d(1, 1, 1);
      }
    }
  }

  p {
    transition: transform .1s ease-out;
    word-break: break-word;
    margin: 0;
    padding: .4em 0;
    transform: scale3d(.75, .75, .75);
    max-width: 1920px;
    opacity: .5;

    &.--accent {
      color: $accent-color;
      opacity: .75;
    }

    &.active {
      transform: scale3d(1, 1, 1);
      opacity: 1;
      will-change: transform;
      transition: transform .1s ease-in;
    }

    @media only screen and (min-width: 640px) {
      transform: scale3d(.65, .65, .65);
      font-size: calc(1em + 1vw);
      padding: .5em 0;
    }
    @media only screen and (max-height: 640px) {
      mask-image: linear-gradient(transparent 0%, black 10%, black 90%, transparent 100%);
      padding: .2em 0;
    }
  }
}
</style>
