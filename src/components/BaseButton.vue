<template>
  <div class="base-button" :class="{'--circle': circle}">
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
}
</script>

<style lang="scss" scoped>
.base-button {
  position: relative;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  border-radius: 2.6em;
  height: 2.6em;
  min-width: 2.6em;
  padding: 0 1.2em;
  overflow: hidden;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  svg {
    height: 1.2em;
    fill: $font-color;
  }

  &.--circle {
    padding: 0;
    max-width: 2.6em;
    svg {
      font-size: 1em;
    }
  }

  *:nth-child(2),
  *:nth-child(3) {
    margin-left: .5em;
  }

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: var(--accent-color-trans);
    height: 100%;
    width: 100%;
    left: 0;
    right: 0;
    transition: opacity .1s, background 1s;
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
