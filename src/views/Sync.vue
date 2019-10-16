<template>
  <div class="the-sync">
    <the-header/>
    <transition name="swap-trans" mode="out-in">
      <div v-if="step === 4" class="the-sync__lines" ref="lyrics" key="lyrics">
        <div class="container current">
          <p class="title accent">[ CURRENT LINE ]</p>
          <transition name="swap-trans" mode="out-in" v-on:enter="resizeText">
            <div class="line" :key="current">
              <p> {{ lyrics[current] }}</p>
            </div>
          </transition>
        </div>
        <div class="container next">
          <p class="title accent">[ NEXT LINE ]</p>
          <transition name="swap-trans" mode="out-in" v-on:enter="resizeText">
            <div class="line --extend" :key="current">
              <p> {{ lyrics[current + 1] }}</p>
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="the-sync__info" key="info">
        <transition name="swap-trans" mode="out-in">
          <div v-if="step === 0" key="one">
            <h2 class="accent">SYNC LYRICS</h2>
            <h3>{{ title }} <span class="highlight">-</span> {{ artist }}</h3>
            <p>Syncing lyrics for a song is easy, just press the <span class="highlight">[ next line ]</span> button or <span class="highlight">[ spacebar ]</span> every time you hear the beginning of a line</p>
            <p>We will start the music when you're ready</p>
            <base-button @click.native="startCountdown">START SYNC</base-button>
          </div>
          <div v-else-if="step === 6" key="two">
            <h2>That's it, well done!</h2>
            <base-button accent @click.native="exit">Return to app</base-button>
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
      <base-button circle transparent @click.native="exit">
        <close/>
      </base-button>
      <base-button v-if="step === 4" class="next" @click.native="next">next line</base-button>
      <base-button circle transparent v-if="step !== 7" @click.native="reset">
        <reload/>
      </base-button>
    </div>
    <template v-if="step === 4">
      <div class="the-sync__progress" :style="progressStyle"></div>
      <span class="the-sync__status">
        {{ current - 1 }} / {{ length - 2 }}
      </span>
    </template>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import BaseButton from '@/components/BaseButton'
import sad from '@/assets/sad.svg'
import close from '@/assets/close.svg'
import reload from '@/assets/reload.svg'
import deviceDelay from '@/mixins/deviceDelay'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
    sad,
    close,
    reload,
  },
  mixins: [ deviceDelay ],
  data () {
    return {
      current: 1,
      step: 0,
      interval: null,
      fetchInterval: null,
      savedTrack: {},
      initiated: false,
      HUMAN_DELAY: -600,
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
    length () {
      return this.lyrics.length
    },
    startTime () {
      return this.updatedAt - (this.progress + this.baseDelay + this.HUMAN_DELAY)
    },
    title () {
      return this.savedTrack.title
    },
    artist () {
      return this.savedTrack.artist
    },
    percent () {
      return (this.current) / this.length
    },
    progressStyle () {
      return {
        transform: `scaleX(${this.percent})`,
      }
    },
  },
  methods: {
    ...mapActions({
      initSync: 'sync/init',
      resetSync: 'sync/reset',
      saveSync: 'sync/save',
      push: 'sync/push',
      startPlayback: 'playback/play',
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
      this.initiated = true
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
      if (this.initiated) {
        this.startPlayback(this.uri)
      }
      this.$router.push('/')
    },
    async reset () {
      clearInterval(this.interval)
      clearInterval(this.fetchInterval)
      this.resetSync()
      this.current = 1
      this.init()
    },
    resizeText (el) {
      const resizeText = () => {
        const old = parseInt(getComputedStyle(el).getPropertyValue('font-size').slice(0, -2))
        el.style.fontSize = old - 1 + 'px'
      }
      while (el.scrollHeight > el.offsetHeight) {
        resizeText()
      }
    },
  },
  async created () {
    if (!this.track.uri || !this.unsynced) {
      return this.$router.push('/')
    }
    this.savedTrack = this.track
    this.init()
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

    p {
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
      font-size: .7em;
      margin-top: 1em;
    }
    
    .highlight {
      color: var(--theme-color-light);
      font-weight: 700;
      line-break: none;
      white-space: nowrap;
    }

    .spinner {
      font-size: 1.2em;
      margin-top: 1em;
    }
  }

  .accent {
    color: var(--theme-color-light);
    opacity: 1;
  }

  &__lines {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    font-size: 2em;
    font-weight: 600;
    text-align: center;
    padding: 0 20px;
    padding-top: calc(60px + 10vh);
    padding-bottom: calc(60px + 10vh);
    overflow: hidden;

    @media only screen and (min-width: 640px) {
      font-size: calc(2em + 1vw);
    }

    .container {
      display: flex;
      flex-flow: column;
      flex: 1 1 0px;
      max-height: 300px;
      overflow: hidden;
      width: 100%;
      padding: 10px 0;
    }

    .line {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .title {
      font-size: .8em;
      padding-bottom: 2vh;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    p {
      display: block;
      line-height: 1.25em;
      padding: 0;
      margin: 0;
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
      font-size: 1em;
      padding: 1.2em 2.6em;
      margin: 0 10px;
    }
  }
  &__progress {
    position: fixed;
    bottom: 0;
    height: 6px;
    background-color: var(--button-color);
    width: 100%;
    transition: transform .2s;
    opacity: var(--button-opacity);
  }
  &__status {
    position: fixed;
    width: 100%;
    bottom: calc(40px + 3.4em);
    font-weight: 700;
    text-align: center;
    font-variant-numeric: tabular-nums;

    @media only screen and (max-height: 500px) {
      display: none;
    }
  }
  .swap-trans-leave-active,
  .swap-trans-enter-active {
    transition:
      opacity .1s ease-out,
      transform .1s ease-out;
    &.--extend {
      transition-delay: .025s;
    }
  }
}
</style>
