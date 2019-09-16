<template>
  <div class="base-page" :class="classList"
    v-touch:moving="movingHandler"
    v-touch:moved="movedHandler"
    v-touch:end="endHandler">
    <div class="base-page__backdrop"></div>
    <div class="base-page__container" :style="styleList">
      <div class="base-page__bg"></div>
      <div class="base-page__content" ref="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  computed: {
    classList () {
      return {
        '--mask': this.mask,
      }
    },
    styleList () {
      return {
        'transform': `translateY(${this.touchOffset}px)`,
        'transition': `transform ${this.touchOffset === 0 ? 0.25 : 0}s`,
      }
    },
  },
  methods: {
    movedHandler (e) {
      this.touchStart = e.touches[0].pageY
    },
    movingHandler (e) {
      const offset = e.touches[0].pageY - this.touchStart
      const time = Date.now()
      if (this.lastTouch) {
        const timeDiff = time - this.lastTouch
        this.velocity = (offset - this.touchOffset) / timeDiff
      }
      this.lastTouch = time
      this.touchOffset = offset > 0 ? offset : 0
    },
    endHandler () {
      if (this.touchOffset > 150 || this.velocity > 2.5) {
        this.$emit('swipe-down')
      }
      this.touchStart = 0
      this.touchOffset = 0
      this.lastTouch = null
    },
  },
}
</script>

<style lang="scss" scoped>
.base-page {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 8;
  opacity: 1;
  transition: transform .1s;

  &.--mask {
    .base-page__content {
      mask-image: linear-gradient(transparent, black 100px, black 100%);
    }
  }

  &__container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  &__backdrop {
    background: black;
    opacity: .25;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  &__bg {
    background: darken($accent-color, 5%);
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0) translateZ(0);
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
    overflow-y: scroll;

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
        color: $red;
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
}
</style>
