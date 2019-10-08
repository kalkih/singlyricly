<template>
  <div class="delay-bar">
    <base-button circle transparent @click.native="sub">
      <minus/>
    </base-button>
    <transition name="swap-trans" mode="out-in">
      <div class="delay-bar__delay" v-if="delay" key="has-delay">
        <transition :name="'fade-' + direction" mode="out-in">
          <span :key="delay">
            {{ delay > 0 ? '+' : '' }}{{ delayInSec }}
          </span>
        </transition>
        <span v-if="!hideTitle" class="delay-bar__delay__title">
          {{ title }}
        </span>
      </div>
      <div class="delay-bar__delay" v-else key="default">
        <span class="delay-bar__delay__title">
          {{ title }}
        </span>
      </div>
    </transition>
    <base-button circle transparent @click.native="add">
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
  props: {
    hideTitle: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      step: 100,
      title: 'offset',
      direction: 'left',
    }
  },
  computed: {
    ...mapState({
      delay: state => state.settings.delay,
    }),
    delayInSec () {
      return (this.delay / 1000).toFixed(1) + 's'
    },
  },
  methods: {
    ...mapActions({
      addDelay: 'settings/addDelay',
      subtractDelay: 'settings/subtractDelay',
    }),
    add () {
      this.direction = 'left'
      this.addDelay(this.step)
      this.feedback()
    },
    sub () {
      this.direction = 'right'
      this.subtractDelay(this.step)
      this.feedback()
    },
    feedback () {
      window.navigator.vibrate(10)
    },
  },
}
</script>

<style lang="scss" scoped>
.delay-bar {
  position: relative;
  flex-flow: row;
  border-radius: 2.6em;
  overflow: hidden;
  display: flex;
  color: var(--button-text-color);

  svg {
    fill: inherit !important;
    &:hover {
      opacity: .75;
    }
  }

  &:before {
    content: '';
    opacity: var(--button-opacity);
    position: absolute;
    z-index: -2;
    height: 100%;
    width: 100%;
    transition: opacity .15s;
    background: inherit;
  }

  &__delay {
    font-size: 1.2em;
    display: flex;
    flex-flow: column-reverse;
    align-items: center;
    justify-content: center;
    width: 5em;
    overflow: hidden;
    font-weight: 700;

    span {
      &:nth-child(2) {
        font-size: .6em;
      }
      font-variant-numeric: tabular-nums;
      letter-spacing: .05em;
      font-size: 1em;
    }

    &__title {
      text-transform: uppercase;
      font-size: .8em !important;
      letter-spacing: .15em !important;
    }
  }
  .swap-trans-leave-active,
  .swap-trans-enter-active {
    transition:
      opacity .1s var(--ease-io-cubic),
      transform .1s var(--ease-io-cubic);
  }
  .fade-left-leave-active,
  .fade-left-enter-active,
  .fade-right-leave-active,
  .fade-right-enter-active {
    transition:
      opacity .075s var(--ease-io-cubic),
      transform .075s var(--ease-io-cubic);
  }
  .fade-left-enter,
  .fade-right-leave-to {
    opacity: 0 !important;
    transform: translateX(2em);
  }
  .fade-left-leave-to,
  .fade-right-enter {
    opacity: 0 !important;
    transform: translateX(-2em);
  }
  .fade-left-enter-to, .fade-left-leave,
  .fade-right-enter-to, .fade-right-leave {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
