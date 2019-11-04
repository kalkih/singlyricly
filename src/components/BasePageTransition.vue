<template>
  <transition name="base-page-transition" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </transition>
</template>
<script>
export default {}
</script>
<style lang="scss">
$long: .3s;
$short: .2s;
.base-page-transition-leave-active,
.base-page-transition-enter-active {
  transition:
    opacity .5s linear !important;

  .base-page__backdrop {
    will-change: opacity;
    transition: opacity $long linear;
  }
  .base-page__content {
    will-change: transform, opacity;
    transition:
      opacity $long var(--ease-io-cubic) calc(#{$short} / 4),
      transform $long var(--ease-io-cubic) calc(#{$short} / 4);
  }
  .base-page__bg {
    will-change: transform;
    transition: transform $short var(--ease-io-cubic);
  }
}
.base-page-transition-leave-active {
  .base-page__content {
    transition:
      opacity $long var(--ease-io-cubic) 0s,
      transform $long var(--ease-io-cubic) 0s;
  }
  .base-page__bg {
    transition: transform $short var(--ease-io-cubic) calc(#{$short} / 2);
  }
}
.base-page-transition-enter,
.base-page-transition-leave-to {
  .base-page__backdrop {
    opacity: 0;
  }
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
