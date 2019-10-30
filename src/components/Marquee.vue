<template>
  <div ref="element" class="marquee" :class="{'--overflow': overflow, '--paused': paused}">
    <resize-observer @notify="resizeHandler" />
    <h2 ref="reference">{{ text }}</h2>
    <div v-if="overflow" class="overflow">
      <h2 :style="sharedStyle">
        {{ text }}
      </h2>
      <h2 :style="{...sharedStyle, left: `${this.width + 28}px`}">
        {{ text }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    paused: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      overflow: true,
      width: 0,
      max: 0,
      DUR_MULTIPLIER: 0.035,
      resizeTimer: null,
      DEBOUNCE_DELAY: 50,
    }
  },
  computed: {
    sharedStyle () {
      const width = this.width + 24
      return {
        'width': `${width}px`,
        'animation-duration': `${(width) * this.DUR_MULTIPLIER}s`,
      }
    },
  },
  methods: {
    checkOverflow () {
      this.checkWidth()
      this.checkAvail()
      this.overflow = this.width > this.max && this.max
    },
    checkWidth () {
      this.width = this.$refs.reference ? this.$refs.reference.clientWidth : 0
      return this.width
    },
    checkAvail () {
      this.max = this.$refs.element ? this.$refs.element.clientWidth : 0
      return this.max
    },
    resizeHandler () {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.checkOverflow()
      }, this.DEBOUNCE_DELAY)
    },
  },
  watch: {
    text () {
      this.checkOverflow()
    },
  },
  mounted () {
    this.checkOverflow()
  },
}
</script>

<style lang="scss" scoped>
.marquee {
  --left-fade: 4px;
  --right-fade: 4px;
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  animation-play-state: running;

  &.--overflow {
    & > h2 {
      opacity: 0;
      transition: opacity .15s linear .05s;
    }
  }
  &.--paused {
    animation-play-state: paused;
  }
  h2 {
    display: inline-block;
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
  }
  & > h2 {
    padding: 0 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    opacity: 1;
    transition: opacity .25s;
  }
  .overflow {
    position: absolute;
    padding-right: 24px;
    width: 100%;
    top: 0;
    right: 0;
    height: 1.4em;
    mask-image: linear-gradient(to right, transparent, black var(--left-fade), black calc(100% - var(--right-fade)), transparent 100%);
    animation: .15s fade linear;

    h2 {
      left: 4px;
      position: absolute;
      animation: 10s linear 0s infinite normal none moving;
      animation-play-state: inherit;
    }
  }
  @keyframes moving {
    0% {
      transform: translateX(0%);
    }
    15% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}
</style>
