<template>
  <div class="now-playing"
    :class="classList"
    v-on="handlers">
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
      <pause v-else-if="playing" key="playing" class="pause"/>
      <play v-else key="paused"/>
    </transition>
    <transition name="swap-trans">
      <div v-if="thumbnail" class="thumbnail" :key="this.thumbnail">
        <img :src="this.thumbnail"/>
      </div>
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
    const vm = this
    return {
      placeholder: 'Nothing playing',
      pressed: false,
      handlers: {
        mousedown: vm.down,
        mouseup: vm.reset,
        touchstart: vm.down,
        touchend: vm.reset,
        mouseleave: vm.reset,
        click: vm.toggle,
      },
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
    classList () {
      return {
        '--active': this.expanded,
        '--pressed': this.pressed,
        '--idle': this.idle,
      }
    },
  },
  methods: {
    ...mapActions({
      toggle: 'playback/toggle',
    }),
    down () {
      this.pressed = true
    },
    reset () {
      this.pressed = false
    },
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
  transition: max-width .25s ease-out, width .25s ease-out, transform .1s ease-out;
  color: var(--button-text-color);

  &.--pressed {
    transform: scale3d(0.9, 0.9, 0.9);
    opacity: .75;

    @media only screen and (min-width: 640px) {
      transform: scale3d(0.95, 0.95, 0.95);
    }
  }

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
      white-space: nowrap;
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
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      padding-left: 4px;
      padding-right: 04px;
    }
    .placeholder {
      font-size: 1.2em;
      font-weight: 600;
      margin-bottom: 2px;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }
  }

  .thumbnail {
    display: none;
  }

  svg {
    position: absolute;
    left: .47em;
    top: .4em;
    height: 1.7em;
    fill: var(--button-text-color);

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
    opacity: var(--button-opacity);
    position: absolute;
    z-index: -2;
    background: var(--button-color);
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
  &.--active {
    max-width: calc(100% - (60px + 20px));
    transition: max-width .15s ease-out;

    .now-playing__text {
      opacity: 1;
    }
    .marquee {
      animation-play-state: running;
    }
  }
  @media only screen and (min-width: 640px) {
    max-width: 100%;

    &.--active {
      max-width: 100%;
    }

    &.--idle {
      .now-playing__text {
        margin-left: 4.4em;
      }
    }

    &:before {
      opacity: var(--button-opacity);
    }
    .now-playing__text {
      margin-left: 5.4em;
    }
    .pause {
      opacity: 0;
      transition: opacity .25s ease;
    }
    .marquee {
      --right-fade: 20px;
    }
    .thumbnail {
      display: block;
      position: absolute;
      left: 0;
      width: 2.6em;
      height: 2.6em;
      border-radius: 2.6em;
      border: 3px solid var(--font-color);
      z-index: -1;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      &:before {
        content: '';
        background: #000;
        opacity: .25;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        transition: opacity .25s ease;
      }
    }
    &:hover {
      transition: max-width .15s ease-out;

      .now-playing__text {
        opacity: .85;
      }
      .pause {
        opacity: 1;
      }
      .thumbnail {
        &:before {
          opacity: .5;
        }
      }
      &:before {
        opacity: var(--button-hover-opacity);
      }
      .marquee {
        animation-play-state: running;
      }
    }
    &__text {
      opacity: 1;
    }
    .marquee {
      animation-play-state: running;
    }
  }
  .fade-leave-active,
  .fade-enter-active {
    transition:
      opacity .15s var(--ease-io-cubic),
      transform .15s var(--ease-io-cubic);
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
