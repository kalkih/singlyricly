<template>
  <div class="the-menu-toggle">
    <base-button circle @click.native="toggleMenu">
      <transition name="swap-trans">
        <div v-if="nestedNav" key="nested">
          <chevron/>
        </div>
        <close v-else-if="menu" key="base"/>
        <hamburger v-else key="closed"/>
      </transition>
    </base-button>
  </div>
</template>

<script>
import BaseButton from './BaseButton'
import menuNav from '@/mixins/menuNav'
import close from '@/assets/close.svg'
import hamburger from '@/assets/hamburger.svg'
import chevron from '@/assets/chevron.svg'

export default {
  components: {
    BaseButton, hamburger, close, chevron,
  },
  mixins: [ menuNav ],
}
</script>

<style lang="scss" scoped>
.the-menu-toggle {

  .base-button {
    > * {
      fill: $font-color;
      height: 1.2em;
      position: absolute;
    }
    > div {
      width: 1.2em;

      svg {
        fill: $font-color;
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
