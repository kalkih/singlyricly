<template>
  <div class="the-menu-toggle">
    <base-button circle @click.native="toggle()">
      <transition name="swap-trans">
        <close v-if="menu" key="open"/>
        <hamburger v-else key="closed"/>
      </transition>
    </base-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseButton from './BaseButton'
import close from '@/assets/close.svg'
import hamburger from '@/assets/hamburger.svg'

export default {
  components: {
    BaseButton, hamburger, close,
  },
  computed: {
    ...mapState({
      menu: state => state.menu,
    }),
  },
  methods: {
    ...mapActions({
      toggle: 'toggleMenu',
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
