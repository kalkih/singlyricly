<template>
  <transition name="page-transition" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </transition>
</template>
<script>
export default {}
</script>
<style lang="scss">
.page-transition-leave-active,
.page-transition-enter-active {
  transition:
    opacity .5s $easeInOutCubic;

  .the-about__content {
    transition:
      opacity .35s $easeInOutCubic,
      transform .35s $easeInOutCubic;
  }
  .the-about__bg {
    transition: transform .25s $easeInOutCubic;
  }
}
.page-transition-leave-active {
  .the-about__content {
    transition-delay: 0s;
    transition:
      opacity .25s $easeInOutCubic,
      transform .25s $easeInOutCubic;
  }
  .the-about__bg {
    transition: transform .25s $easeInOutCubic .1s;
  }
}
.page-transition-enter,
.page-transition-leave-to {
  .the-about__content {
    opacity: 0;
    transform: translateY(2em);
  }
  .the-about__bg {
    transform: translateY(100vh) translateZ(0);
  }
}
.page-transition-enter-to, .page-transition-leave {
  .the-about__content {
    opacity: 1;
    transform: translateY(0);
  }
  .the-about__bg {
    transform: translateY(0) translateZ(0);
  }
}
</style>
