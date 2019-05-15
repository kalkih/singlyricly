<template>
  <div class="now-playing">
    <transition name="fade" mode="out-in">
      <span v-bind:key="hasInfo" class="now-playing__text">
        {{ hasInfo ? `${artist} - ${title}`  : placeholder }}
      </span>
    </transition>
    <transition name="fade" mode="out-in">
      <pause v-if="playing" @click="pause"/>
    </transition>
    <transition name="fade" mode="out-in">
      <play v-if="!playing" @click="play"/>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import play from '@/assets/play.svg'
import pause from '@/assets/pause.svg'

export default {
  components: {
    play, pause,
  },
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
    thumbnail () {
      return this.track.thumbnail
    },
    hasInfo () {
      return this.track.title || this.track.artist
    },
  },
  methods: {
    ...mapActions({
      play: 'playback/play',
      pause: 'playback/pause',
    }),
  },
}
</script>

<style lang="scss" scoped>
.now-playing {
  position: relative;
  cursor: pointer;
  display: block;
  font-size: 1.4em;
  border-radius: 2.6em;
  user-select: none;
  overflow: hidden;
  font-weight: 500;
  display: flex;
  height: 2.6em;
  align-items: center;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  max-width: 2.6em;
  transition: max-width .25s ease-out, width .25s ease-out;

  &__text {
    margin-left: 2.5em;
    margin-right: .8em;
    opacity: 0;
    transition: opacity .25s;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 2.6em;
    line-height: 2.6em;
  }

  &__thumbnail {
    position: absolute;
    left: 0;
    width: 2.6em;
    border-radius: 2.6em;
  }

  svg {
    position: absolute;
    left: .47em;
    top: .4em;
    height: 1.7em;
    fill: $font-color;

    &:hover {
      opacity: .75;
    }

    &.svg-play, &.svg-pause {
      width: 1.2em;
      left: .7em;
    }
  }

  span:nth-child(2):before {
    content: '-';
  }

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: $accent-color;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: opacity .15s;
    transform: translateZ(0);
  }

  &:hover {
    max-width: calc(100vw - 20px - 1em);
    transition: max-width .15s ease-out;
    z-index: 99;

    .now-playing__text {
      opacity: 1;
    }
    &:before {
      opacity: .65;
    }
  }

  @media only screen and (min-width: 640px) {
    max-width: 50vw;

    &__text {
      opacity: 1;
    }
  }
  .fade-leave-active,
  .fade-enter-active {
    transition:
      opacity .15s ease-out,
      transform .15s ease-out;
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
