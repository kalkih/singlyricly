<template>
  <transition name="menu-transition" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </transition>
</template>
<script>
export default {}
</script>
<style lang="scss">
.menu-transition-leave-active,
.menu-transition-enter-active {
  transition:
    opacity .5s $easeInOutCubic,
    background-color 0s ease-in .25s;

  .the-menu__content {
    will-change: opacity, transform;
    transition:
      opacity .35s $easeInOutCubic,
      transform .35s $easeInOutCubic;
  }
  .the-menu__bg {
    will-change: transform;
    transition: transform .35s $easeInOutCubic;
    @media only screen and (min-width: 640px) {
      transition: transform .25s $easeInOutCubic;
    }
  }
}
.menu-transition-leave-active {
  transition:
    opacity .5s $easeInOutCubic,
    background-color 0s ease-in .15s;

  .the-menu__content {
    transition:
      opacity .25s $easeInOutCubic,
      transform .25s $easeInOutCubic;
  }
  .the-menu__bg {
    transition: transform .25s $easeInOutCubic .1s;
  }
}
.menu-transition-enter,
.menu-transition-leave-to {
  background-color: transparent !important;

  .the-menu__content {
    opacity: 0;
    transform: translateY(2em) translateZ(0);
  }
  .the-menu__bg {
    transform: scale3d(1, 1, 1) translateZ(0);
    @media only screen and (min-width: 640px) {
      transform: translateY(100vh) translateZ(0);
    }
  }
}
.menu-transition-enter-to, .menu-transition-leave {
  background-color: $accent-color;

  .the-menu__content {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
  .the-menu__bg {
    transform: scale3d(50, 50, 50) translateZ(0);
    @media only screen and (min-width: 640px) {
      transform: translateY(0) translateZ(0);
    }
  }
}
</style>
