<template>
  <div class="the-menu-toggle">
    <base-button circle transparent @click="toggleMenu">
      <transition name="swap-trans">
        <div v-if="nestedNav" key="nested">
          <chevron/>
        </div>
        <close v-else-if="menu" key="base"/>
        <dots v-else key="closed"/>
      </transition>
    </base-button>
  </div>
</template>

<script>
import BaseButton from './BaseButton'
import menuNav from '@/mixins/menuNav'
import close from '@/assets/close.svg'
import dots from '@/assets/dots.svg'
import chevron from '@/assets/chevron.svg'

export default {
  components: {
    BaseButton, close, chevron, dots,
  },
  mixins: [menuNav],
}
</script>

<style lang="scss" scoped>
.the-menu-toggle {

  .base-button {
    > * {
      height: 1.2em;
      position: absolute;
    }
    .svg-dots {
      height: 1.8em;
    }
    > div {
      width: 1.2em;

      svg {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
