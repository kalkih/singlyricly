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
  // transition:
  //   opacity .5s cubic-bezier(0.645, 0.045, 0.355, 1),
  //   background-color .25s ease-in;
  transition:
    opacity .5s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s ease-in .25s;

  .the-menu__content {
    transition:
      opacity .35s cubic-bezier(0.645, 0.045, 0.355, 1),
      transform .35s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .the-menu__bg {
    transition: transform .35s cubic-bezier(0.645, 0.045, 0.355, 1);
    @media only screen and (min-width: 640px) {
      transition: transform .25s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}
.menu-transition-leave-active {
  // transition:
  //   opacity .75s cubic-bezier(0.645, 0.045, 0.355, 1),
  //   background-color .5s ease-in;
  transition:
    opacity .5s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s ease-in .15s;

  .the-menu__content {
    transition-delay: 0s;
    transition:
      opacity .25s cubic-bezier(0.645, 0.045, 0.355, 1),
      transform .25s cubic-bezier(0.645, 0.045, 0.355, 1);;
  }
  .the-menu__bg {
    transition:
      transform .25s cubic-bezier(0.645, 0.045, 0.355, 1) .1s;
  }
}
.menu-transition-enter,
.menu-transition-leave-to {
  background-color: transparent !important;

  .the-menu__content {
    opacity: 0;
    transform: translateY(2em);
  }
  .the-menu__bg {
    transform: scale(1) translateZ(0);
    @media only screen and (min-width: 640px) {
      transform: translateY(100vh) translateZ(0);
    }
  }
}
.menu-transition-enter-to, .menu-transition-leave {
  background-color: $accent-color;

  .the-menu__content {
    opacity: 1;
    transform: translateY(0);
  }
  .the-menu__bg {
    transform: scale(50) translateZ(0);
    @media only screen and (min-width: 640px) {
      transform: translateY(0) translateZ(0);
    }
  }
}
</style>
