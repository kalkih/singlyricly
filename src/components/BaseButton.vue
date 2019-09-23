<template>
  <div class="base-button"
    :class="classList"
    v-on="handlers">
    <span v-if="text">{{ text }}</span>
    <span v-if="icon">{{ icon }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    icon: {
      type: String,
    },
    circle: {
      type: Boolean,
    },
  },
  data () {
    const vm = this
    return {
      pressed: false,
      handlers: {
        mousedown: vm.down,
        mouseup: vm.reset,
        touchstart: vm.down,
        touchend: vm.reset,
        mouseleave: vm.reset,
      },
    }
  },
  methods: {
    down (ev) {
      this.pressed = true
    },
    reset (ev) {
      this.pressed = false
    },
  },
  computed: {
    classList () {
      return {
        '--circle': this.circle,
        '--pressed': this.pressed,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.base-button {
  position: relative;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  height: auto;
  min-width: 2.6em;
  padding: 1.2em 2em;
  border-radius: 2.6em;
  overflow: hidden;
  font-size: 1.4em;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: .15em;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform .1s ease-out;
  transform: scale3d(1, 1, 1);

  svg {
    height: 1.2em;
    fill: $font-color;
  }

  &.--circle {
    padding: 0;
    max-width: 2.6em;
    height: 2.6em;
    svg {
      font-size: 1em;
    }
  }

  &.--pressed {
    transform: scale3d(0.9, 0.9, 0.9);
    opacity: .75;

    @media only screen and (min-width: 640px) {
      transform: scale3d(0.95, 0.95, 0.95);
    }
  }

  *:nth-child(2),
  *:nth-child(3) {
    margin-left: .5em;
  }

  &:before {
    content: '';
    opacity: .6;
    position: absolute;
    z-index: -2;
    background: $accent-color;
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    transition: opacity .1s;
    border-radius: 2.6em;
    transform: translateZ(0);
  }

  &:hover {
    &:before {
      opacity: .75;
    }
  }
}
</style>
