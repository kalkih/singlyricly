<template>
  <div class="the-sync">
    <the-header/>
    <transition name="swap-trans" mode="out-in">
      <div v-if="step === 4" class="the-sync__lyrics" ref="lyrics" key="lyrics">
        <transition name="line-trans" mode="out-in">
          <p :key="current"> {{ lyrics[current - 1] }}</p>
        </transition>
        <transition name="line-trans" mode="out-in">
          <p :key="current" class="active"> {{ lyrics[current] }}</p>
        </transition>
        <transition name="line-trans" mode="out-in">
          <p :key="current">{{ lyrics[current + 1] }}</p>
        </transition>
      </div>
      <div v-else class="the-sync__info" key="info">
        <transition name="swap-trans" mode="out-in">
          <div v-if="step === 0" key="one">
            <h2>SYNC LYRICS</h2>
            <h3>{{ track.title }} - {{ track.artist }}</h3>
            <p>Syncing lyrics for a song is easy, just press the <span class="highlight">[ next line ]</span> button or <span class="highlight">[ spacebar ]</span> when you hear the beginning of each next line</p>
            <p>We will start the music when you're ready</p>
            <base-button @click.native="startCountdown">I'm ready!</base-button>
          </div>
          <div v-else-if="step === 6" key="two">
            <h2>That's it, well done!</h2>
            <base-button @click.native="exit">Return to app</base-button>
          </div>
          <div v-else-if="step === 5" key="three">
            <h2>Processing your sync</h2>
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div v-else-if="step === 1" key="four">
            <h2 class="--cd">3</h2>
          </div>
          <div v-else-if="step === 2" key="five">
            <h2 class="--cd">2</h2>
          </div>
          <div v-else-if="step === 3" key="six">
            <h2 class="--cd">1</h2>
          </div>
          <div v-else>
            <sad/>
            <h2>Oops! Something went wrong, please try again</h2>
            <base-button @click.native="exit">Reload</base-button>
          </div>
        </transition>
      </div>
    </transition>
    <base-button v-if="step === 4" class="next-line__button" @click.native="next">Next line</base-button>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import BaseButton from '@/components/BaseButton'
import sad from '@/assets/sad.svg'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
    sad,
  },
  data () {
    return {
      current: 1,
      delay: 0,
      baseDelay: -150,
      startTime: null,
      step: 0,
      interval: null,
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      unsynced: state => state.lyrics.normal,
      lyrics: state => state.sync.lyrics,
      uri: state => state.sync.track.uri,
    }),
    ...mapGetters({
      hasSynced: 'lyrics/hasSynced',
    }),
    length () {
      return this.lyrics.length
    },
  },
  methods: {
    ...mapActions({
      initSync: 'sync/init',
      resetSync: 'sync/reset',
      saveSync: 'sync/save',
      push: 'sync/push',
      startPlayback: 'playback/playTrack',
      clearPlayback: 'playback/clear',
      clearLyrics: 'lyrics/clearLyrics',
    }),
    progress () {
      return Date.now() - this.startTime + this.delay + this.baseDelay
    },
    keyEvent (ev) {
      const { keyCode } = ev
      if (keyCode === 32) {
        this.next()
      }
    },
    async next () {
      this.current += 1
      this.pushLine(this.current)
      if (this.current >= this.length - 1 && this.step === 4) {
        this.step = 5
        window.removeEventListener('keydown', this.keyEvent)
        const saved = await this.saveSync()
        if (saved) {
          this.step = 6
        } else {
          this.step = 7
        }
      }
    },
    startCountdown () {
      this.countdown()
      this.interval = setInterval(this.countdown, 1000)
    },
    countdown () {
      if (this.step === 3) {
        this.startSyncing()
        clearInterval(this.interval)
      } else {
        this.step += 1
      }
    },
    pushLine (num) {
      const line = {
        milliseconds: this.progress(),
        line: this.lyrics[num] || '',
      }
      this.push(line)
    },
    async startSyncing () {
      try {
        const { start, delay } = await this.startPlayback(this.uri)
        this.step = 4
        this.startTime = start
        this.delay = delay
        window.addEventListener('keydown', this.keyEvent)
      } catch (err) {
        this.step = 7
      }
    },
    async init () {
      this.step = 0
      await this.initSync({ lyrics: this.unsynced, track: this.track })
    },
    exit () {
      this.clearPlayback()
      this.clearLyrics()
      this.startPlayback(this.uri)
      this.$router.push('/')
    },
    async reset () {
      clearInterval(this.interval)
      this.step = 0
      this.resetSync()
    },
  },
  async created () {
    if (!this.track.uri || !this.unsynced || this.hasSynced) {
      this.$router.push('/')
    }
    this.init()
  },
  beforeDestroy () {
    this.reset()
    window.removeEventListener('keydown', this.keyEvent)
  },
}
</script>

<style lang="scss" scoped>
.the-sync {
  height: 100vh;

  &__info {
    width: 100%;
    height: 100%;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.4em;
    animation: fade-in .5s ease-out;

    @media only screen and (min-width: 640px) {
      font-size: calc(1em + 1vw);
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
    }

    .--cd {
      font-size: 4em;
      margin: 0;
    }

    h2 {
      color: $accent-color;
    }

    p {
      color: $font-color;
      font-size: .8em;
      margin: 0 0 1em 0;
      line-height: 1.5em;
    }

    h2, h3 {
      margin-top: 0;
    }

    svg {
      height: 5em;
      margin-bottom: 1em;
    }

    .base-button {
      font-size: .8em;
      color: $font-color;
    }

    .highlight {
      color: $accent-color;
      font-weight: 600;
      line-break: none;
      white-space: nowrap;
    }

    .spinner {
      font-size: 1.2em;
      margin-top: 1em;
    }
  }

  &__lyrics {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    font-size: 2em;
    font-weight: 600;
    text-align: center;
    margin: 0 1em;
    overflow: hidden;

    @media only screen and (min-width: 640px) {
      font-size: calc(2em + 1vw);
    }

    p {
      line-height: 1em;
      min-height: 1em;
      transform: scale3d(.75,.75,.75);
      opacity: .55;
    }

    .active {
      transform: scale3d(1,1,1);
      opacity: 1;
    }
  }
  .next-line__button {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);
  }
  .line-trans-leave-active,
  .line-trans-enter-active {
    transition:
      opacity .1s ease-out,
      transform .1s ease-out;
  }
  .line-trans-enter {
    opacity: 0 !important;
    transform:
      translateY(1em)
      scale3d(.75,.75,.75);
  }
  .line-trans-leave-to {
    opacity: 0 !important;
    transform:
      translateY(-1em)
      scale3d(.75,.75,.75);
  }
}
</style>
