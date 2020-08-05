<template>
  <div class="base-toggle" @click.prevent="() => $emit('toggle', !state)">
    <span v-if="label" class="base-toggle__label">{{ label }}</span>
    <div class="base-toggle__switch" :class="{ '--checked': state }" :style="styleList" ref="toggle"></div>
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
    return {
      pressed: false,
      active: false,
      touchStart: 0,
      touchOffset: 0,
      dragPosition: null,
      width: 0,
    }
  },
  methods: {
    moveHandler (e) {
      e.stopPropagation()
      if (this.touchOffset > 0) e.preventDefault()
      if (!this.touchStart) {
        this.width = e.target.getBoundingClientRect().width
        this.touchStart = e.touches[0].pageX
      }
      const offset = e.touches[0].pageX - this.touchStart
      this.touchOffset = Math.min(Math.max(offset, -this.width), this.width)
      const currentState = this.state ? this.width : 0
      const newPos = Math.min(Math.max(currentState + this.touchOffset, 0), this.width)
      this.dragPosition = (newPos / this.width) * 100
    },
    endHandler (e) {
      if (Math.abs(this.touchOffset) > 10) {
        e.stopPropagation()
        if (this.dragPosition >= 50) {
          !this.state && this.$emit('toggle', true)
        } else {
          this.state && this.$emit('toggle', false)
        }
      }
      this.touchStart = 0
      this.touchOffset = 0
      this.dragPosition = null
    },
  },
  computed: {
    styleList () {
      return this.dragPosition !== null && {
        '--override': `${this.dragPosition}%`,
        '--opacity': Math.max(this.dragPosition / 100, 0.65),
        '--transition': `none`,
      }
    },
  },
  mounted () {
    this.$refs.toggle.addEventListener('touchmove', this.moveHandler)
    this.$refs.toggle.addEventListener('touchend', this.endHandler)
  },
  beforeDestroy () {
    this.$refs.toggle.removeEventListener('touchmove', this.moveHandler)
    this.$refs.toggle.removeEventListener('touchend', this.endHandler)
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
  transform: translateZ(0);
  font-size: 1em;

  &__label {
    font-size: 1.1em;
    margin-right: 2em;
    order: 0;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: .075em;
  }

  &__switch {
    font-size: .8em;
    position: relative;
    width: calc(6em - 8px);
    height: 3em;
    border-radius: 3em;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);

    --transition: transform .35s, background-color .25s, opacity .35s;

    &:before {
      content: '';
      position: absolute;
      height: 100%;
      left: 0;
      right: 0;
      background-color: var(--font-color);
      border-radius: 3em;
      opacity: var(--opacity, .65);
      transition: var(--transition);
    }

    &:after {
      content: '';
      position: absolute;
      width: calc(3em - 8px);
      height: calc(3em - 8px);
      background-color: var(--font-color);
      left: 4px;
      top: 4px;
      border-radius: 3em;
      transition: var(--transition);
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
      transform: translateX(var(--override, 0%));
    }

    &.--checked {
      &:after {
        transform: translateX(var(--override, 100%));
        background-color: var(--theme-color);
      }
      &:before {
        opacity: var(--opacity, 1);
      }
    }
  }
}
</style>
