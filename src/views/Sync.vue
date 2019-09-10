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
            <h3>{{ title }} - {{ artist }}</h3>
            <p>Syncing lyrics for a song is easy, just press the <span class="highlight">[ next line ]</span> button or <span class="highlight">[ spacebar ]</span> when you hear the beginning of each next line</p>
            <p>We will start the music when you're ready</p>
            <base-button @click.native="startCountdown">I'm ready!</base-button>
          </div>
          <div v-else-if="step === 6" key="two">
            <h2>That's it, well done!</h2>
            <base-button @click.native="exit">Return to app</base-button>
          </div>
          <div v-else-if="step === 5" key="three">
            <h2>Processing synced lyrics</h2>
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
    <div class="the-sync__buttons">
      <base-button circle @click.native="exit">
        <close/>
      </base-button>
      <base-button v-if="step === 4" class="next" @click.native="next">next line</base-button>
      <base-button v-if="step !== 7" circle @click.native="reset">
        <reload/>
      </base-button>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import BaseButton from '@/components/BaseButton'
import sad from '@/assets/sad.svg'
import close from '@/assets/close.svg'
import reload from '@/assets/reload.svg'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
    sad,
    close,
    reload,
  },
  data () {
    return {
      current: 1,
      baseDelay: -650,
      step: 0,
      interval: null,
      fetchInterval: null,
      savedTrack: {},
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      updatedAt: state => state.playback.updatedAt,
      progress: state => state.playback.progress,
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
    startTime () {
      return this.updatedAt - (this.progress + this.baseDelay)
    },
    title () {
      return this.savedTrack.title
    },
    artist () {
      return this.savedTrack.artist
    },
  },
  methods: {
    ...mapActions({
      initSync: 'sync/init',
      resetSync: 'sync/reset',
      saveSync: 'sync/save',
      push: 'sync/push',
      startPlayback: 'playback/playTrack',
      fetchPlayback: 'playback/fetchPlayback',
      clearPlayback: 'playback/clear',
      clearLyrics: 'lyrics/clearLyrics',
    }),
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
        const saved = await this.saveSync(this.startTime)
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
        timestamp: Date.now(),
        line: this.lyrics[num] || '',
      }
      this.push(line)
    },
    async startSyncing () {
      try {
        await this.startPlayback(this.uri)
        this.step = 4
        window.addEventListener('keydown', this.keyEvent)
        this.fetchInterval = setInterval(this.getPlayback, 1000)
      } catch (err) {
        this.step = 7
      }
    },
    getPlayback () {
      if (this.progress) {
        clearInterval(this.fetchInterval)
      } else {
        this.fetchPlayback()
      }
    },
    async init () {
      this.step = 0
      await this.initSync({ lyrics: this.unsynced, track: this.savedTrack })
      this.clearPlayback()
    },
    exit () {
      this.clearPlayback()
      this.clearLyrics()
      this.startPlayback(this.uri)
      this.$router.push('/')
    },
    async reset () {
      clearInterval(this.interval)
      clearInterval(this.fetchInterval)
      this.resetSync()
      this.current = 1
      this.init()
    },
  },
  async created () {
    if (!this.track.uri || !this.unsynced || this.hasSynced) {
      return this.$router.push('/')
    }
    this.savedTrack = this.track
    this.init()
    console.log(this.track)
  },
  beforeDestroy () {
    clearInterval(this.interval)
    clearInterval(this.fetchInterval)
    this.resetSync()
    window.removeEventListener('keydown', this.keyEvent)
  },
}
</script>

<style lang="scss" scoped>
.the-sync {
  height: 100%;

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
      line-height: 1.25em;
      min-height: 1em;
      transform: scale3d(.75,.75,.75);
      opacity: .55;
    }

    .active {
      transform: scale3d(1,1,1);
      opacity: 1;
    }
  }
  &__buttons {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .next {
      text-align: center;
      font-size: 1em;
      padding: 1.2em 2.6em;
      height: auto;
      font-weight: 700;
      margin: 0 10px;
      text-transform: uppercase;
      letter-spacing: .15em;
    }
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
