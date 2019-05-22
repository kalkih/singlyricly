<template>
  <div class="the-menu-toggle">
    <base-button circle @click.native="handleClick">
      <transition name="swap-trans">
        <chevron v-if="about" key="about"/>
        <close v-else-if="menu" key="open"/>
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
import chevron from '@/assets/chevron.svg'

export default {
  components: {
    BaseButton, hamburger, close, chevron,
  },
  computed: {
    ...mapState({
      menu: state => state.menu,
      about: state => state.about,
    }),
  },
  methods: {
    ...mapActions({
      toggle: 'toggleMenu',
      toggleAbout: 'toggleAbout',
    }),
    handleClick () {
      if (this.about) {
        this.toggleAbout(false)
      } else {
        this.toggle()
      }
    },
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
