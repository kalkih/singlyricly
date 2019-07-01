<template>
  <div class="the-lyrics-screen">
    <transition name="lyrics-trans" mode="out-in">
      <the-lyrics v-if="hasLyrics" :isSynced="hasSynced" key="lyrics"/>
      <div v-else class="the-lyrics-screen__info" key="info">
        <transition name="lyrics-trans" mode="out-in">
          <div v-if="searching" key="loading">
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h2>We're getting your lyrics, stay tuned!</h2>
          </div>
          <div v-else-if="!progress" class="not-available" key="none">
            <play/>
            <h2>Play something on Spotify and check back here</h2>
          </div>
          <div class="not-found" v-else key="404">
            <sad/>
            <h2>Sorry but we couldn't find any lyrics for this track</h2>
            <router-link to="/add" tag="div">
              <base-button>Add lyrics</base-button>
            </router-link>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      padding: 1.2em 2em;
      margin: 1em 0;
      height: auto;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .075em;
      margin-top: 2em;

      @media only screen and (min-width: 640px) {
        padding: 1em 2em;
        font-size: .5em;
      }
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
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
      margin-bottom: 3em;
    }
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
