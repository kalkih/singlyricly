<template>
  <div class="swipe-track" :style="styleList" ref="screen">
    <div class="swipe-track-content">
      <slot></slot>
    </div>
    <div class="swipe-track-actions">
      <div class="swipe-track-actions__prev">
        <chevron/>
        <span>Skip</span>
      </div>
      <div class="swipe-track-actions__next">
        <chevron/>
        <span>Skip</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import chevron from '@/assets/chevron.svg'

const X = 0
const Y = 1

export default {
  name: 'SwipeSkipProvider',
  components: {
    chevron,
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
        this.$refs.screen.removeEventListener('touchmove', this.moveHandler)
        this.disable = true
      }
      if (Math.abs(this.dragPosition) >= 55) {
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
      this.dragPosition = null
      this.initialTimer = false
    },
    handleAction () {
      if (this.dragPosition >= 50) {
        window.navigator.vibrate(8)
        this.prev()
      }
      if (this.dragPosition <= -50) {
        window.navigator.vibrate(8)
        this.next()
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
        '--override': `${this.dragPosition}%`,
        '--opacity': 1 - Math.abs(this.dragPosition / 100, 0),
        '--transition': 'none',
      }
    },
  },
  mounted () {
    this.$refs.screen.addEventListener('touchmove', this.moveHandler, { passive: true })
    this.$refs.screen.addEventListener('touchend', this.endHandler)
  },
  beforeDestroy () {
    this.$refs.screen.removeEventListener('touchmove', this.moveHandler)
    this.$refs.screen.removeEventListener('touchend', this.endHandler)
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
    transform: translateX(var(--override, 0%));
    transition: var(--transition);
    opacity: var(--opacity, 1)
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
  opacity: calc(calc(0 - var(--opacity, 1) + 1) * 1.75);
  transition: var(--transition);
  pointer-events: none;

  &__prev,
  &__next {
    font-size: 1.4em;
    padding: 1em;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: var(--transition);

    span {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .075em;
      font-size: .8em;
    }

    svg {
      display: block;
      height: 2em;
      margin-bottom: .4em;
    }
  }
  &__next {
    transform:
      translateX(max(calc((var(--override, 0%) * 3) + 100%), -25%))
      scale(max(calc(var(--opacity, 1) + 0.5), 1));
    svg {
      transform: rotate(-180deg);
    }
  }
  &__prev {
    transform:
      translateX(min(calc((var(--override, 0%) * 3) - 100%), 25%))
      scale(max(calc(var(--opacity, 1) + 0.5), 1));
  }
}
</style>
