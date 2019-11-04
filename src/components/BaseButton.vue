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
    transparent: {
      type: Boolean,
    },
    accent: {
      type: Boolean,
    },
  },
  data () {
    const vm = this
    return {
      pressed: false,
      active: false,
      handlers: {
        mousedown: vm.down,
        mouseup: vm.reset,
        touchstart: vm.down,
        touchend: vm.reset,
        mouseleave: vm.reset,
        mouseover: vm.hover,
      },
    }
  },
  methods: {
    hover () {
      this.active = true
    },
    down () {
      this.active = true
      this.pressed = true
    },
    reset () {
      this.active = false
      this.pressed = false
    },
  },
  computed: {
    classList () {
      return {
        '--circle': this.circle,
        '--pressed': this.pressed,
        '--hover': this.active,
        '--transparent': this.transparent,
        '--accent': this.accent,
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
  color: var(--button-text-color);
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
    fill: var(--button-text-color);
  }

  &.--circle {
    padding: 0;
    max-width: 2.6em;
    height: 2.6em;
    svg {
      font-size: 1em;
    }
  }

  &.--transparent {
    color: var(--font-color);

    &.--hover {
      &:before {
        opacity: .05;
      }
    }
    svg {
      fill: var(--font-color);

      &:hover {
        opacity: 1;
      }
    }

    &:before {
      opacity: 0;
    }
  }

  &.--accent {
    color: var(--font-color);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.25);

    &.--hover {
      &:before {
        opacity: .75;
      }
    }

    &:before {
      background: var(--theme-color);
      opacity: .65;
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
    opacity: var(--button-opacity);
    position: absolute;
    z-index: -2;
    background: var(--button-color);
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    transition: opacity .15s;
    border-radius: 2.6em;
    transform: translateZ(0);
  }

  &.--hover {
    &:before {
      opacity: var(--button-hover-opacity);
    }
  }
}
</style>
