<template>
  <transition name="base-page-transition" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </transition>
</template>
<script>
export default {}
</script>
<style lang="scss">
.base-page-transition-leave-active,
.base-page-transition-enter-active {
  transition:
    opacity .5s $easeInOutCubic !important;

  .base-page__content {
    will-change: transform, opacity;
    transition:
      opacity .35s $easeInOutCubic,
      transform .35s $easeInOutCubic;
  }
  .base-page__bg {
    will-change: transform;
    transition: transform .25s $easeInOutCubic;
  }
}
.base-page-transition-leave-active {
  .base-page__content {
    transition:
      opacity .25s $easeInOutCubic,
      transform .25s $easeInOutCubic;
  }
  .base-page__bg {
    transition: transform .25s $easeInOutCubic .1s;
  }
}
.base-page-transition-enter,
.base-page-transition-leave-to {
  .base-page__content {
    opacity: 0;
    transform: translateY(2em);
  }
  .base-page__bg {
    transform: translate3d(0, 100%, 0) translateZ(0);
  }
}
.base-page-transition-enter-to, .base-page-transition-leave {
  .base-page__content {
    opacity: 1;
    transform: translate3d(0, 0, 0) translateZ(0);
  }
  .base-page__bg {
    transform: translate3d(0, 0, 0) translateZ(0);
  }
}
</style>
