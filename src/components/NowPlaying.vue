<template>
  <div class="now-playing"
    :class="classList"
    v-on="handlers">
    <transition name="fade" mode="out-in">
      <div v-bind:key="hasInfo" class="now-playing__text">
        <template v-if="hasInfo">
          <marquee class="title" :text="title"/>
          <marquee class="artist" :text="artist"/>
        </template>
        <span v-else class="placeholder">
          {{ placeholder }}
        </span>
      </div>
    </transition>
    <div class="icon">
      <transition name="swap-trans">
        <note v-if="idle" key="idle" class="note"/>
        <pause v-else-if="playing" key="playing"/>
        <play v-else key="paused"/>
      </transition>
    </div>
    <transition name="swap-trans">
      <div v-if="thumbnail" class="thumbnail" :key="thumbnail">
        <img :src="thumbnail"/>
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
  mixins: [scrollHelper],
  data () {
    const vm = this
    return {
      placeholder: 'Nothing playing',
      pressed: false,
      interact: false,
      interactTimer: null,
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
        '--interact': this.interact,
        '--pressed': this.pressed,
        '--idle': this.idle,
        '--playing': this.playing,
      }
    },
  },
  methods: {
    ...mapActions({
      toggle: 'playback/toggle',
    }),
    down () {
      this.pressed = true
      this.interactDebouncer()
    },
    reset () {
      this.pressed = false
    },
    interactDebouncer () {
      clearTimeout(this.interactTimer)
      this.interact = true
      this.interactTimer = setTimeout(() => {
        this.interact = false
      }, 2000)
    },
  },
  watch: {
    active (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.interactDebouncer()
      }
    },
    playing (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.interactDebouncer()
      }
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
    margin-left: 5.3em;
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
      font-weight: 600;
    }
    .title {
      font-size: 1.5em;
      height: 1.2em;
      margin-bottom: 0.2em;
    }
    .artist,
    .placeholder {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      font-size: 1.2em;
    }
    .artist {
      opacity: .8;
      font-weight: 500;
      height: 1.2em;
    }
    .placeholder {
      margin-bottom: 2px;
    }
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
      background: var(--theme-color-dark);
      opacity: .25;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      transition: opacity .25s ease;
    }
  }

  .icon {
    transition: opacity .25s ease;
    opacity: 1;
  }

  svg {
    position: absolute;
    left: .47em;
    top: .4em;
    height: 1.7em;

    &:hover {
      opacity: .75;
    }

    &.svg-play, &.svg-pause, &.svg-note {
      width: 1.2em;
      left: .7em;
    }
  }

  .marquee {
    animation-play-state: paused;
    --right-fade: 20px;
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

  &.--playing {
    .icon {
      opacity: 0;
    }
    .thumbnail {
      &:before {
        opacity: 0;
      }
    }
  }

  &.--idle {
    .icon {
      opacity: 1;
    }
    .now-playing__text {
      margin-left: 4.4em;
    }
  }

  &.--interact {
    .icon {
      opacity: 1;
    }
    .thumbnail {
      &:before {
        opacity: .25;
      }
    }
  }

  @media only screen and (min-width: 640px) {
    max-width: 100%;

    &.--active {
      max-width: 100%;
    }
    .marquee {
      animation-play-state: running;
    }
    .now-playing__text,
    .icon {
      opacity: 1;
    }
    &:hover {
      transition: max-width .15s ease-out;
      .now-playing__text {
        opacity: .85;
      }
      .icon {
        opacity: 1;
      }
      .thumbnail {
        &:before {
          opacity: .25;
        }
      }
      .marquee {
        animation-play-state: running;
      }
    }
  }
  .fade-leave-active,
  .fade-enter-active {
    transition:
      opacity .15s linear,
      transform .15s linear;
  }
  .fade-enter-from {
    opacity: 0 !important;
    transform: translateY(1em);
  }
  .fade-leave-to {
    opacity: 0 !important;
    transform: translateY(-1em);
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
