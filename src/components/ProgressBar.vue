<template>
  <div class="progress-bar" :style="styleObject">
  </div>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      transition: 0,
      progress: 0,
    }
  },
  computed: {
    styleObject () {
      return {
        'transitionDuration': `${this.transition}ms`,
        'backgroundSize': `${this.progress}% 100%`,
      }
    },
  },
  methods: {
    reset () {
      this.transition = 0
      this.progress = 0

      setTimeout(() => {
        this.transition = this.delay ? this.delay - 60 : 0
        this.progress = 100
      }, 60)
    },
  },
}
</script>

<style lang="scss" scoped>
.progress-bar {
  position: absolute;
  bottom: 0;
  height: 10px;
  width: 100%;
  background-image: linear-gradient($accent-color, $accent-color);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition-property: background-size;
  transition-timing-function: linear;
  transition-timing-function: ease-out;

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100%;
    left: 0;
    background: black;
    opacity: .15;
  }
}
</style>
