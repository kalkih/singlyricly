<template>
  <div class="the-menu-toggle">
    <base-button circle @click.native="toggle()">
      <transition name="fade">
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

  .fade-leave-active,
  .fade-enter-active {
    opacity: 0;
    transition:
      opacity .15s ease-out,
      transform .15s ease-out;
  }
  .fade-enter {
    transform: translateY(1em);
  }
  .fade-leave-to {
    transform: translateY(-1em);
  }
  .fade-enter-to, .fade-leave {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
