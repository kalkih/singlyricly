<template>
  <div class="now-playing" :class="{'active': this.expanded}">
    <transition name="fade" mode="out-in">
      <div v-bind:key="hasInfo" class="now-playing__text">
        <template v-if="hasInfo">
          <marquee class="title" :text="title" :paused="false"/>
          <h2 class="artist">
            {{ artist }}
          </h2>
        </template>
        <span v-else class="placeholder">
          {{ placeholder }}
        </span>
      </div>
    </transition>
    <transition name="swap-trans">
      <note v-if="idle" key="idle"/>
      <pause v-else-if="playing" @click="pause" key="playing"/>
      <play v-else @click="play" key="paused"/>
    </transition>
  </div>
</template>

<script>
import Marquee from './Marquee'
import play from '@/assets/play.svg'
import pause from '@/assets/pause.svg'
import note from '@/assets/note.svg'
import scrollHelper from '@/mixins/scrollHelper'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Marquee,
    play,
    pause,
    note,
  },
  mixins: [ scrollHelper ],
  data () {
    return {
      placeholder: 'Nothing playing',
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      playing: state => state.playback.playing,
      active: state => state.nowPlayingState,
    }),
    ...mapGetters({
      idle: 'playback/isIdle',
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
    expanded () {
      return this.active && this.scroll && this.delayedScrollStatus
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
  min-width: 2.6em;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  max-width: 2.6em;
  transition: max-width .25s ease-out, width .25s ease-out;

  &__text {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-flow: column;
    font-size: .6em;
    text-align: left;
    margin-left: 3.8em;
    margin-right: 1.4em;
    opacity: 0;
    transition: opacity .25s;
    overflow: hidden;

    h2 {
      margin: 0;
      padding: 0;
      letter-spacing: .025em;
    }
    .title, .artist, .placeholder {
      letter-spacing: .025em;
    }
    .title {
      font-size: 1.34em;
      height: 1.1em;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .artist {
      opacity: .8;
      font-size: 1.2em;
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      padding-left: 4px;
    }
    .placeholder {
      font-size: 1.2em;
    }
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

    &.svg-play, &.svg-pause, &.svg-note {
      width: 1.2em;
      left: .7em;
    }
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
    border-radius: 2.6em;
  }

  .marquee {
    animation-play-state: paused;
  }
  &.active {
    max-width: calc(100% - (60px + 20px));
    transition: max-width .15s ease-out;

    .now-playing__text {
      opacity: 1;
    }
    &:before {
      opacity: .65;
    }
    .marquee {
      animation-play-state: running;
    }
  }
  @media only screen and (min-width: 640px) {
    max-width: 50vw;

    &.active {
      max-width: 50vw;
    }
    &:hover {
      max-width: 100%;
      transition: max-width .15s ease-out;

      .now-playing__text {
        opacity: 1;
      }
      &:before {
        opacity: .65;
      }
      .marquee {
        animation-play-state: running;
      }
    }
    &:before {
      opacity: .65;
    }
    &__text {
      opacity: 1;
    }
    .marquee {
      animation-play-state: running;
    }
  }
  &:hover {
    &:before {
      opacity: .75;
    }
  }
  .fade-leave-active,
  .fade-enter-active {
    transition:
      opacity .15s $easeInOutCubic,
      transform .15s $easeInOutCubic;
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
