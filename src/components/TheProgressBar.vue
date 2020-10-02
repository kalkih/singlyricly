<template>
  <div class="the-progress-bar" :class="{ '--hide': hide, '--seek': this.seekProgress }"
    v-on="handlers">
    <div class="progress" :style="styleObject"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import throttle from 'lodash.throttle'

export default {
  name: 'TheProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    updatedAt: null,
  },
  data () {
    const vm = this
    return {
      transition: 0,
      position: 0,
      seekProgress: null,
      handlers: {
        touchstart: vm.initSeek,
        mousedown: vm.initSeek,
        touchend: vm.handleSeek,
        mouseup: vm.handleSeek,
        mouseleave: vm.resetSeek,
      },
      offset: 40,
    }
  },
  computed: {
    styleObject () {
      return {
        'transitionDuration': `${this.transition}ms`,
        'backgroundSize': `${this.seekProgress || this.position}% 100%`,
      }
    },
  },
  methods: {
    ...mapActions({
      seek: 'playback/seek',
      setAutoSync: 'lyrics/setScroll',
    }),
    reset (progress = this.computeProgress()) {
      this.transition = 0
      this.position = (progress / this.duration) * 100

      setTimeout(() => {
        this.transition = this.duration - progress
        this.position = 100
      }, 60)
    },
    computeProgress () {
      return this.progress + (Date.now() - this.updatedAt)
    },
    throttledEmit (position) {
      this.$emit('seeking', position)
    },
    setSeekPosition (position) {
      this.seekProgress = position && (position / this.duration) * 100
      this.emitSeek(position)
    },
    initSeek (e) {
      const x = e.offsetX || e.touches[0].pageX - this.offset / 2
      this.seekWidth = window.innerWidth - this.offset
      this.setSeekPosition(this.calcProgress(x))
      window.addEventListener('touchmove', this.moveSeek, true)
      window.addEventListener('mousemove', this.moveSeek)
    },
    resetSeek () {
      if (this.seekProgress) {
        this.reset()
      }
      this.setSeekPosition(null)
      window.removeEventListener('touchmove', this.moveSeek, true)
      window.removeEventListener('mousemove', this.moveSeek)
    },
    moveSeek (e) {
      e.preventDefault()
      e.stopPropagation()
      const x = e.offsetX || e.touches[0].pageX - this.offset / 2
      this.setSeekPosition(this.calcProgress(x))
    },
    handleSeek (e) {
      this.resetSeek()
      const x = e.offsetX || e.changedTouches[0].pageX - this.offset / 2
      this.seek(this.calcProgress(x))
      this.setAutoSync(true)
    },
    calcProgress (x) {
      const pos = (x / this.seekWidth) * this.duration
      return pos
    },
  },
  created () {
    this.reset()
    this.emitSeek = throttle(this.throttledEmit, 75)
  },
}
</script>

<style lang="scss" scoped>
.the-progress-bar {
  position: absolute;
  bottom: 20px;
  z-index: 200;
  width: calc(100% - 40px);
  left: 20px;
  right: 20px;
  height: 20px;
  cursor: pointer;
  transform-origin: center;
  transition: transform .2s var(--ease-io-cubic), opacity .35s;
  opacity: 1;
  -webkit-tap-highlight-color: transparent;

  &.--hide {
    opacity: 0;
    pointer-events: none;
    transition: transform .2s var(--ease-io-cubic), opacity .15s;
  }

  &.--seek {
    transform: scaleY(3);

    .progress {
      transition: none !important;
    }
  }
}
.progress {
  overflow: hidden;
  height: 6px;
  border-radius: 3px;
  position: absolute;
  width: 100%;
  top: calc(14px / 2);
  background-image: linear-gradient(var(--theme-color), var(--theme-color));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition-property: background-size;
  transition-timing-function: linear;

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(255,255,255,.85);
  }
}
</style>
