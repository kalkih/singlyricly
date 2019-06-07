<template>
  <div class="the-menu-toggle">
    <base-button circle @click.native="toggleMenu">
      <transition name="swap-trans">
        <chevron v-if="about" key="about"/>
        <close v-else-if="menu" key="open"/>
        <hamburger v-else key="closed"/>
      </transition>
    </base-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState({
      menu: state => state.menu,
      about: state => state.about,
    }),
  },
}
</script>

<style lang="scss" scoped>
.the-menu-toggle {

  .base-button {
    svg {
      fill: $font-color;
      height: 1.2em;
      position: absolute;
    }
  }
}
</style>
