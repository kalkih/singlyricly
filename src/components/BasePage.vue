<template>
  <div class="base-page" :class="classList" ref="page">
    <div class="base-page__backdrop"></div>
    <div class="base-page__container" :style="containerStyle">
      <div class="base-page__bg">
        <transition name="fade-bg">
          <div :key="themeColorDark" :style="bgStyle"></div>
        </transition>
      </div>
      <div class="base-page__content" ref="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    mask: {
      type: Boolean,
    },
  },
  data () {
    return {
      touchStart: 0,
      touchOffset: 0,
      touchVelocity: 0,
      lastTouch: null,
      SWIPE_THRESHOLD: 100,
      VEL_THRESHOLD: 2.5,
      VEL_NEG_THRESHOLD: -0.05,
    }
  },
  computed: {
    ...mapState({
      themeColorDark: state => state.theme.dark ? state.theme.dark.hsl() : 'var(--theme-color-dark)',
    }),
    scrollPos () {
      return this.$refs.content.scrollTop
    },
    classList () {
      return {
        '--mask': this.mask,
      }
    },
    containerStyle () {
      return {
        'transform': `translateY(${this.touchOffset}px)`,
        'transition': `transform ${this.touchOffset === 0 ? 0.25 : 0}s`,
      }
    },
    bgStyle () {
      return {
        'background': this.themeColorDark,
      }
    },
  },
  methods: {
    moveHandler (e) {
      e.stopPropagation()
      if (this.$refs.content.scrollTop !== 0) return
      if (this.touchOffset > 0) e.preventDefault()
      if (!this.touchStart) {
        this.touchStart = e.touches[0].pageY
      }
      const offset = e.touches[0].pageY - this.touchStart
      const time = Date.now()
      if (this.lastTouch) {
        const timeDiff = time - this.lastTouch
        this.velocity = (offset - this.touchOffset) / timeDiff
      }
      this.lastTouch = time
      this.touchOffset = offset > 0 ? offset : offset / 3
    },
    endHandler (e) {
      e.stopPropagation()
      if (this.isThresholdMet()) {
        this.$emit('swipe-down')
      }
      this.touchStart = 0
      this.touchOffset = 0
      this.lastTouch = null
    },
    isThresholdMet () {
      return (this.touchOffset > this.SWIPE_THRESHOLD ||
        this.velocity > this.VEL_THRESHOLD) &&
        this.velocity > this.VEL_NEG_THRESHOLD
    },
  },
  mounted () {
    this.$refs.page.addEventListener('touchmove', this.moveHandler)
    this.$refs.page.addEventListener('touchend', this.endHandler)
  },
  beforeDestroy () {
    this.$refs.page.removeEventListener('touchmove', this.moveHandler)
    this.$refs.page.removeEventListener('touchend', this.endHandler)
  },
}
</script>

<style lang="scss" scoped>
.base-page {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 8;
  opacity: 1;
  transition: transform .1s;
  justify-content: center;
  text-align: center;
  align-items: center;
  overflow: hidden;
  overscroll-behavior: contain;

  &.--mask {
    .base-page__content {
      mask-image: linear-gradient(transparent, black 100px, black 100%);
    }
  }

  &__container {
    height: 100%;
    width: 100%;
    flex-flow: column;
    display: flex;
    align-items: inherit;
    position: relative;
  }

  &__backdrop {
    background: var(--bg-color);
    opacity: .25;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  &__bg {
    background: var(--bg-nested-color);
    position: absolute;
    width: 100%;
    height: 200%;
    transform: translate3d(0, 0, 0) translateZ(0);

    > div {
      position: absolute;
      height: 100%;
      width: 100%;
    }
  }

  &__content {
    font-size: .8em;
    display: flex;
    flex-flow: column;
    align-items: inherit;
    text-align: inherit;
    padding: 20px;
    height: 100%;
    width: 100%;
    touch-action: pan-y;
    z-index: 10;
    overflow-y: auto;
    align-self: center;
    transform: translateZ(0);

    @media only screen and (max-width: 320px) {
      font-size: .6em;
    }
    @media only screen and (min-width: 640px) {
      font-size: 1em;
    }

    > p {
      color: rgba(255,255,255,.75);
      transition: opacity .1s ease-out;
      font-weight: 600;
    }

    > h1, h2 {
      opacity: 1;
      margin: .8em 0 0 0;
      -webkit-tap-highlight-color: transparent;
      font-weight: 600;

      &.--red {
        color: var(--color-red);
      }
    }

    h2 {
      font-size: 1.8em;
    }

    .--fine {
      position: fixed;
      bottom: 0;
      opacity: .75;
      font-weight: 500;
      font-size: .8em;
      margin: 2em 100px;
      left: 0;
      right: 0;
    }

    > div:last-child {
      margin-top: auto;
      margin-bottom: 0;
      width: 100%;
    }

    > div:first-child {
      margin-top: 0;
      margin-bottom: auto;
      width: 100%;
    }
  }

  .fade-bg-leave-active,
  .fade-bg-enter-active {
    transition: opacity .25 linear;
  }
}
</style>
