<template>
  <div class="the-lyrics-screen" @click="() => toggle()">
    <transition name="lyrics-trans" mode="out-in">
      <the-lyrics v-if="hasLyrics" :isSynced="hasSynced" key="lyrics"/>
      <div v-else class="the-lyrics-screen__info" key="info">
        <transition name="lyrics-trans" mode="out-in">
          <div v-if="errored" class="not-found" key="error">
            <sad/>
            <h2>{{ error.message }}</h2>
            <base-button @click.native="refresh">REFRESH</base-button>
          </div>
          <div v-else-if="searching" key="loading">
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h2>We're getting your lyrics, stay tuned!</h2>
          </div>
          <div v-else-if="!progress" class="not-available" key="none">
            <play class="anim-in"/>
            <h2>Play something on Spotify and check back here</h2>
          </div>
          <div class="not-found" v-else key="404">
            <sad/>
            <h2>Sorry but we couldn't find any lyrics for this track</h2>
            <base-button accent @click.native="add">Add lyrics</base-button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import TheLyrics from '@/components/TheLyrics'
import BaseButton from '@/components/BaseButton'
import sad from '@/assets/sad.svg'
import play from '@/assets/play.svg'

export default {
  name: 'TheLyricsScreen',
  components: {
    sad,
    play,
    TheLyrics,
    BaseButton,
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      progress: state => state.playback.progress,
      searching: state => state.lyrics.searching,
      error: state => state.error,
    }),
    ...mapGetters({
      errored: 'errored',
    }),
    hasLyrics () {
      return !!(this.synced || this.normal)
    },
    hasSynced () {
      return !!(this.synced)
    },
    hasNormal () {
      return !!(this.normal)
    },
  },
  methods: {
    ...mapActions({
      toggle: 'toggleNowPlayingState',
    }),
    refresh () {
      window.location.reload()
    },
    add () {
      this.$router.push('add')
    },
  },
  mounted () {
    setTimeout(() => {
      this.toggle(true)
    }, 750)
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics-screen {
  position: relative;
  font-weight: 600;
  width: 100%;
  font-size: 1.8em;
  text-align: center;
  letter-spacing: .015em;
  display: flex;
  align-items: center;
  flex-flow: row;
  height: 100%;

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

    @media only screen and (max-height: 640px) {
      font-size: 1.2em;
    }

    .base-button {
      font-size: .5em;
      margin: 2.6em 0 1em 0;
      padding: 1.4em 2.6em;
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
    }

    svg {
      opacity: .85;
      height: 4em;
      margin-bottom: 1em;
    }

    h2 {
      font-size: 1em;
      opacity: .85;
      margin: 0;
    }

    .spinner {
      font-size: .8em;
      margin-bottom: 3em;
    }
  }

  @keyframes scale-up {
    0% {
      opacity: 0;
      transform: scale(.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .anim-in {
    animation-name: scale-up;
    animation-duration: .5s;
    transform-origin: bottom;
    animation-timing-function: cubic-bezier(0.500, 0.250, 0.225, 1.395);
  }

  .lyrics-trans-leave-active {
    transition:
      opacity .15s ease-out,
      transform .15s ease-out;
  }
  .lyrics-trans-enter-active {
    transition:
      opacity .25s ease-out,
      transform .25s ease-out;
  }
  .lyrics-trans-enter {
    opacity: 0 !important;
    transform: translateY(10px);
  }
  .lyrics-trans-leave-to {
    opacity: 0 !important;
    transform: translateY(-10px);
  }
  .lyrics-trans-enter-to, .lyrics-trans-leave {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
