<template>
  <div class="delay-bar">
    <base-button circle @click.native="sub">
      <minus/>
    </base-button>
    <transition name="swap-trans" mode="out-in">
      <div class="delay-bar__delay" v-if="delay" key="has-delay">
        <transition :name="'fade-' + direction" mode="out-in">
          <span :key="delay">
            {{ delay > 0 ? '+' : '' }}{{ delay }}
          </span>
        </transition>
        <span v-if="!hideTitle">
          {{ title }}
        </span>
      </div>
      <div class="delay-bar__delay" v-else key="default">
        <span>
          {{ title }}
        </span>
      </div>
    </transition>
    <base-button circle @click.native="add">
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
  },
  methods: {
    ...mapActions({
      set: 'settings/setDelay',
      addDelay: 'settings/addDelay',
      subtractDelay: 'settings/subtractDelay',
    }),
    add () {
      this.direction = 'left'
      this.addDelay(this.step)
    },
    sub () {
      this.direction = 'right'
      this.subtractDelay(this.step)
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
  font-weight: 600;

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: var(--accent-color-trans);
    transition: background 1s !important;
    height: 100%;
    width: 100%;
    transition: opacity .15s;
  }

  &__delay {
    font-size: 1.4em;
    display: flex;
    flex-flow: column-reverse;
    align-items: center;
    justify-content: center;
    width: 4.6em;
    overflow: hidden;
    font-weight: inherit;

    span {
      &:nth-child(2) {
        font-size: .6em;
        opacity: 1;
      }
      opacity: .85;
      font-variant-numeric: tabular-nums;
      letter-spacing: .05em;
      font-weight: inherit;
      font-size: 1em;
      color: white;
    }
  }
  .swap-trans-leave-active,
  .swap-trans-enter-active {
    transition:
      opacity .1s $easeInOutCubic,
      transform .1s $easeInOutCubic;
  }
  .fade-left-leave-active,
  .fade-left-enter-active,
  .fade-right-leave-active,
  .fade-right-enter-active {
    transition:
      opacity .075s $easeInOutCubic,
      transform .075s $easeInOutCubic;
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
