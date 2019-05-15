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
    background-color 0s ease-in;
  transition-delay: .25s;

  .the-menu__content {
    transition:
      opacity .35s cubic-bezier(0.645, 0.045, 0.355, 1),
      transform .35s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .the-menu__bg {
    transition:
      transform .25s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity .15s cubic-bezier(0.645, 0.045, 0.355, 1) .1s;
  }
}
.menu-transition-leave-active {
  // transition:
  //   opacity .75s cubic-bezier(0.645, 0.045, 0.355, 1),
  //   background-color .5s ease-in;
  transition:
    opacity .75s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s ease-in .15s;

  .the-menu__content {
    transition-delay: 0s;
    transition:
      opacity .25s cubic-bezier(0.645, 0.045, 0.355, 1),
      transform .25s cubic-bezier(0.645, 0.045, 0.355, 1);;
  }
  .the-menu__bg {
    transition:
      transform .25s cubic-bezier(0.645, 0.045, 0.355, 1) .15s,
      opacity .35s cubic-bezier(0.645, 0.045, 0.355, 1) .25s;
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
    transform: scale(1);
  }
}
.menu-transition-leave-to {
  .the-menu__content {
    transform: translateY(2em);
  }
  .the-menu__bg {
    opacity: 0 !important;
  }
}
.menu-transition-enter-to, .menu-transition-leave {
  background-color: $accent-color;

  .the-menu__content {
    transform: translateY(0);
  }
  .the-menu__bg {
    transform: scale(50);
  }
}
</style>
