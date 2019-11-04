<template>
  <div class="the-track-info">
    <transition name="fade" mode="out-in">
      <div v-bind:key="hasInfo" class="the-track-info__container">
        <span class="track">
          {{ title }}
        </span>
        <span class="artist">
          {{ artist }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      placeholder: 'Nothing playing',
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      playing: state => state.playback.playing,
    }),
    title () {
      return this.track.title
    },
    artist () {
      return this.track.artist
    },
    hasInfo () {
      return this.track.title || this.track.artist
    },
  },
}
</script>

<style lang="scss" scoped>
.the-track-info {
  padding: .6em 0 .6em;

  &__container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-flow: column;
    font-size: 1.2em;
    text-align: left;

    > span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }

    .track {
      font-size: .9em;
    }
    .artist {
      opacity: .75;
      font-size: .8em;
    }
  }

  .fade-leave-active,
  .fade-enter-active {
    transition:
      opacity .15s linear,
      transform .15s linear;
  }
  .fade-enter {
    opacity: 0 !important;
    transform: translateY(1em);
  }
  .fade-leave-to {
    opacity: 0 !important;
    transform: translateY(-1em);
  }
  .fade-enter-to, .fade-leave {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
