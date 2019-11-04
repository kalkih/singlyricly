<template>
  <div
    class="the-scroll-override-bar"
    :class="classList"
    :style="styleList">
  </div>
</template>

<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classList () {
      return {
        '--anim': !this.active,
      }
    },
    styleList () {
      return {
        '--offset': this.offset,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.the-scroll-override-bar {
  height: 3px;
  position: fixed;
  bottom: 0;
  width: 100%;
  opacity: 1;
  transition: unset;
  --offset: 0;

  @media only screen and (min-width: 640px) {
    --anim-height: 40;
  }

  &.--anim {
    &:after,
    &:before {
      background: var(--font-color);
      animation: 1s override forwards;
      transition: unset;
      opacity: 0;
    }
  }
  &:after,
  &:before {
    content: '';
    position: absolute;
    width: 10%;
    bottom: 0;
    top: 0;
    left: 0;
    background: var(--font-color);
    opacity: calc((var(--offset) / 10 - .5) + .5);
    transition: transform .05s;
    transform: scaleX(calc(var(--offset) / 2));
    transform-origin: left bottom;
  }

  &:after {
    left: unset;
    right: 0;
    transform-origin: right bottom;
  }

  @keyframes override {
    0% {
      opacity: .25;
      transform: scaleX(10);
    }
    50% {
      transform: scaleX(10) scaleY(var(--anim-height, 500));
      opacity: 0;
    }
  }
}
</style>
