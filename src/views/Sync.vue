<template>
  <div class="the-sync">
    <the-header/>

    <transition name="swap-trans" mode="out-in">
      <div v-if="syncing" class="the-sync__lyrics" ref="lyrics" key="lyrics">
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
        <div v-if="complete">
          <h2>Complete</h2>
          <router-link to="/">
            <base-button>Return to app</base-button>
          </router-link>
        </div>
      </div>
    </transition>
    <base-button v-if="syncing" class="next-line__button" @click.native="next">Next line</base-button>
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
      syncing: true,
      complete: false,
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      unsynced: state => state.lyrics.normal,
      lyrics: state => state.sync.lyrics,
      uri: state => state.sync.uri,
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
        this.syncing = false
        this.complete = true
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
      await this.initSync({ lyrics: this.unsynced, uri: this.uri })
      const { start, delay } = await this.startPlayback(this.track.uri)
      this.startTime = start
      this.delay = delay
    },
  },
  async created () {
    if (!this.track.uri || !this.unsynced || this.hasSynced) {
      this.$router.push('/')
    }
    this.startSyncing()
  },
  destroyed () {
    this.resetSync()
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
    color: $accent-color;
    display: flex;
    align-items: center;
    justify-content: center;

    @media only screen and (min-width: 640px) {
      font-size: calc(1.2em + 1vw);
    }

    @media only screen and (max-height: 640px) {
      font-size: 1.2em;
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
      animation: fade-in .5s ease-out;
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
