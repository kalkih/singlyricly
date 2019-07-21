<template>
  <div ref="element" class="marquee" :class="{'--overflow': overflow, '--paused': paused}">
    <h2 ref="reference">{{ text }}</h2>
    <template v-if="overflow">
      <h2 :style="sharedStyle">
        {{ text }}
      </h2>
      <h2 :style="{...sharedStyle, left: `${this.width + 32}px`}">
        {{ text }}
      </h2>
    </template>
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
      speed: 0.035,
      resizeTimer: null,
    }
  },
  computed: {
    sharedStyle () {
      const width = this.width + 24
      return {
        'width': `${width}px`,
        'animation-duration': `${(width) * this.speed}s`,
      }
    },
  },
  methods: {
    checkOverflow () {
      this.overflow = this.checkWidth() > this.checkAvail()
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
      }, 100)
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
  created () {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy () {
    clearTimeout(this.resizeTimer)
    window.removeEventListener('resize', this.resizeHandler)
  },

}
</script>

<style lang="scss" scoped>
.marquee {
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  animation-play-state: running;

  &.--overflow {
    mask-image: linear-gradient(to right, transparent -2px, black 8px, black calc(100% - 8px), transparent 100%);

    h2:nth-child(1) {
      visibility: hidden;
    }
  }
  &.--paused {
    animation-play-state: paused;
  }
  & > * {
    display: inline-block;
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
  }
  h2:nth-child(1n+2) {
    position: absolute;
    padding-right: 24px;
    top: 0;
    left: 8px;
    animation: 10s linear 0s infinite normal none moving;
    animation-play-state: inherit;
  }
  @keyframes moving {
    0% {
      transform:translateX(0%);
    }
    15% {
      transform:translateX(0%);
    }
    100% {
      transform:translateX(-100%);
    }
  }
}
</style>
