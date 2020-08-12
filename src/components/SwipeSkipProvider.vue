<template>
  <div class="swipe-track" :style="styleList" ref="screen">
    <div class="swipe-track-content">
      <slot></slot>
    </div>
    <div class="swipe-track-actions">
      <div class="swipe-track-actions__action" :class="{ '--next': !this.isRightSwipe }">
        <skip/>
        <span v-if="this.isRightSwipe">previous track</span>
        <span v-else>skip track</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import skip from '@/assets/skip.svg'

const X = 0
const Y = 1
const SWIPE_THRESHOLD = 25
const SWIPE__TRIGGER_THRESHOLD = 40

export default {
  name: 'SwipeSkipProvider',
  components: {
    skip,
  },
  props: {
  },
  data () {
    return {
      pressed: false,
      active: false,
      touchStart: null,
      touchOffset: 0,
      dragPosition: null,
      width: 0,
      disable: false,
    }
  },
  methods: {
    ...mapActions({
      next: 'playback/next',
      prev: 'playback/previous',
    }),
    moveHandler (e) {
      if (this.disable) return
      if (!this.touchStart) {
        this.width = e.target.getBoundingClientRect().width
        this.touchStart = [e.touches[0].pageX, e.touches[0].pageY]
      }
      this.touchOffset = [
        e.touches[0].pageX - this.touchStart[X],
        e.touches[0].pageY - this.touchStart[Y],
      ]
      if (!this.active && this.checkMinThreshold()) {
        this.active = true
      }
      const offset = (this.touchOffset[X] / this.width) * 100
      this.dragPosition = Math.min(Math.max(offset, -100), 100)
      if (!this.active && Math.abs(this.touchOffset[Y]) > 20) {
        this.reset()
        this.$refs.screen.removeEventListener('touchmove', this.moveHandler, { passive: true })
        this.disable = true
      }
      if (Math.abs(this.dragPosition) >= SWIPE__TRIGGER_THRESHOLD) {
        this.handleAction()
        this.disable = true
      }
    },
    endHandler (e) {
      this.handleAction()
      this.disable = false
      this.$refs.screen.addEventListener('touchmove', this.moveHandler, { passive: true })
    },
    reset () {
      this.active = false
      this.touchOffset = null
      // this.dragPosition = null
      this.initialTimer = false
    },
    handleAction () {
      if (this.active) {
        if (this.dragPosition >= SWIPE_THRESHOLD) {
          window.navigator.vibrate && window.navigator.vibrate(8)
          this.prev()
        }
        if (this.dragPosition <= -SWIPE_THRESHOLD) {
          window.navigator.vibrate && window.navigator.vibrate(8)
          this.next()
        }
      }
      this.touchStart = null
      this.reset()
    },
    checkMinThreshold () {
      return Math.abs(this.touchOffset[X]) > 20
    },
  },
  computed: {
    styleList () {
      return this.active && this.dragPosition !== null && {
        '--progress': 1 - Math.abs(this.dragPosition / 100, 0),
        '--opacity': (1 - Math.abs(this.dragPosition / 50, 0)) ** 5,
        '--transition': 'none',
      }
    },
    isRightSwipe () {
      return this.dragPosition > 0
    },
  },
  mounted () {
    this.$refs.screen.addEventListener('touchmove', this.moveHandler, { passive: true })
    this.$refs.screen.addEventListener('touchend', this.endHandler, { passive: true })
  },
  beforeDestroy () {
    this.$refs.screen.removeEventListener('touchmove', this.moveHandler, { passive: true })
    this.$refs.screen.removeEventListener('touchend', this.endHandler, { passive: true })
  },
}
</script>

<style lang="scss" scoped>
.swipe-track {
  --transition: transform .45s,  opacity .5s;
  width: 100%;
  height: 100%;

  .swipe-track-content {
    width: 100%;
    height: 100%;
    transform:
      scale(max(calc(var(--progress, 1)), 0.75));
    transition: var(--transition);
    opacity: var(--opacity, 1);
  }
}

.swipe-track-actions {
  z-index: 200;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  opacity: calc(0 - var(--opacity, 1) + 1);
  transform: scale(max(calc(calc(var(--opacity, 1) + 1)), 0.5));
  transition: var(--transition);
  pointer-events: none;

  &__action {
    font-size: 1.4em;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;

    span {
      font-weight: 600;
      font-size: 1.2em;
    }

    svg {
      display: block;
      height: 5em;
      margin-right: 1em;
    }
  }

  .--next {
    svg {
      transform: rotate(-180deg);
      margin: 0;
    }
  }
}
</style>
