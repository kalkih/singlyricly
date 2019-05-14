<template>
  <div class="delay-bar">
    <base-button circle @click.native="subtract(step)">
      <minus/>
    </base-button>
    <transition name="fade" mode="out-in">
      <div class="delay-bar__delay">
        <span>
          {{ title }}
        </span>
        <span>
          {{ delay }}
        </span>
      </div>
    </transition>
    <base-button circle @click.native="add(step)">
      <plus/>
    </base-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseButton from './BaseButton'
import plus from '@/assets/plus.svg'
import minus from '@/assets/minus.svg'

export default {
  components: {
    BaseButton, plus, minus,
  },
  data () {
    return {
      step: 100,
      title: 'Delay',
    }
  },
  computed: {
    ...mapState({
      delay: state => state.settings.delay,
    }),
  },
  methods: {
    ...mapActions({
      set: 'settings/setDelay',
      add: 'settings/addDelay',
      subtract: 'settings/subtractDelay',
    }),
  },
}
</script>

<style lang="scss" scoped>
.delay-bar {
  flex-flow: row;
  border-radius: 2.6em;
  overflow: hidden;
  display: none;
  animation: reveal-bottom .25s ease-out;

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: $accent-color;
    height: 100%;
    width: 100%;
    transition: opacity .15s;
  }

  &__delay {
    font-size: 1.4em;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 5em;

    > span {
      &:first-child {
        font-size: .6em;
        opacity: 1;
      }
      opacity: .85;
      font-variant-numeric: tabular-nums;
      letter-spacing: .05em;
      font-weight: 700;
      font-size: 1.2em;
      color: white;
    }
  }
  @media only screen and (min-width: 640px) {
    display: flex;
  }
}
</style>
