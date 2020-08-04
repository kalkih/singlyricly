<template>
  <div class="the-progress-bar" :class="{ '--hide': hide }">
    <div class="progress" :style="styleObject"></div>
  </div>
</template>

<script>
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
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      transition: 0,
      position: 0,
    }
  },
  computed: {
    styleObject () {
      return {
        'transitionDuration': `${this.transition}ms`,
        'backgroundSize': `${this.position}% 100%`,
      }
    },
  },
  methods: {
    reset (progress) {
      this.transition = 0
      this.position = ((progress || this.progress) / this.duration) * 100

      setTimeout(() => {
        this.transition = this.duration - (progress || this.progress)
        this.position = 100
      }, 60)
    },
  },
  created () {
    this.reset()
  },
}
</script>

<style lang="scss" scoped>
.the-progress-bar {
  position: absolute;
  bottom: 0;
  z-index: 200;
  width: 100%;
  height: 10px;
  cursor: pointer;
  transform-origin: bottom;
  transition: transform .2s var(--ease-io-cubic), opacity .35s;
  opacity: 1;

  &:hover {
    transform: scaleY(2);
  }

  &.--hide {
    opacity: 0;
    pointer-events: none;
    transition: transform .2s var(--ease-io-cubic), opacity .15s;
  }
}
.progress {
  height: 3px;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition-property: background-size;
  transition-timing-function: linear;

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100%;
    left: 0;
    background: white;
    opacity: 0;
  }
}
</style>
