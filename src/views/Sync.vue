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
            <p>Syncing lyrics for a song is easy, just press the next line button when you hear the beginning of the next line</p>
            <p>We will start the music when you're ready</p>
            <base-button @click.native="startCountdown">I'm ready!</base-button>
          </div>
          <div v-else-if="step === 5" key="two">
            <h2>That's it, well done!</h2>
            <router-link to="/">
              <base-button>Return to app</base-button>
            </router-link>
          </div>
          <div v-else-if="step === 1" key="three">
            <h2 class="--cd">3</h2>
          </div>
          <div v-else-if="step === 2" key="four">
            <h2 class="--cd">2</h2>
          </div>
          <div v-else-if="step === 3" key="five">
            <h2 class="--cd">1</h2>
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
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
  },
  data () {
    return {
      current: 1,
      delay: 0,
      baseDelay: -100,
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
    }),
    progress () {
      return Date.now() - this.startTime + this.delay + this.baseDelay
    },
    next () {
      this.current += 1
      this.pushLine(this.current)
      if (this.current >= this.length - 1) {
        this.step = 5
        this.saveSync()
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
      console.log(line)
      this.push(line)
    },
    async startSyncing () {
      const { start, delay } = await this.startPlayback(this.uri)
      this.step = 4
      this.startTime = start
      this.delay = delay
    },
    async init () {
      this.step = 0
      await this.initSync({ lyrics: this.unsynced, track: this.track })
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
  destroyed () {
    this.reset()
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

    .base-button {
      font-size: .8em;
      color: $font-color;
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
