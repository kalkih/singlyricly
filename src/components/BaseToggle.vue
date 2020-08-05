<template>
  <div class="base-toggle"
    :class="classList"
    v-on="handlers">
      <span v-if="label" class="base-toggle__label">{{ label }}</span>
      <div class="base-toggle__switch" :class="{ '--checked': state }"></div>
  </div>

</template>

<script>
export default {
  name: 'BaseToggle',
  props: {
    label: {
      type: String,
    },
    state: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data () {
    const vm = this
    return {
      pressed: false,
      active: false,
      handlers: {},
    }
  },
  methods: {
  },
  computed: {
    classList () {
      return {}
    },
  },
}
</script>

<style lang="scss" scoped>
.base-toggle {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &__label {
    font-size: 1.1em;
    margin-right: 2em;
    order: 0;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: .075em;
  }

  &__switch {
    font-size: 10px;
    position: relative;
    width: calc(6em - 4px);
    height: 3em;
    border-radius: 3em;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);

    &:before {
      content: '';
      position: absolute;
      height: 100%;
      left: 0;
      right: 0;
      background-color: var(--font-color);
      border-radius: 3em;
      opacity: .5;
      transition: opacity .35s;
    }

    &:after {
      content: '';
      position: absolute;
      width: calc(3em - 4px);
      height: calc(3em - 4px);
      background-color: var(--font-color);
      left: 2px;
      top: 2px;
      border-radius: 3em;
      transition: transform .35s, background-color .25s;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
    }

    &.--checked {
      &:after {
        transform: translateX(100%);
        background-color: var(--theme-color);
      }
      &:before {
        opacity: 1;
      }
    }
  }
}
</style>
