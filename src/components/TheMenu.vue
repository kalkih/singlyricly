<template>
  <div class="the-menu">
    <div class="the-menu__bg"></div>
    <div class="the-menu__content">
      <h1>About</h1>
      <h1>Something</h1>
      <h1>Something else</h1>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
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
.the-menu {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $accent-color;
  z-index: 8;
  opacity: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;

  &__bg {
    background: $accent-color;
    bottom: 20px;
    right: 20px;
    position: absolute;
    width: 3.6em;
    height: 3.6em;
    border-radius: 3.6em;
    transform: scale(50) translateZ(0);
    z-index: -1;

    @media only screen and (min-width: 640px) {
      bottom: unset;
      top: 0;
      right: 0;

      border-radius: 0;
      width: 100%;
      height: 100vh;
      transform: translateY(0) translateZ(0);
    }
  }

  &__content {
    display: flex;
    flex-flow: column;
    align-items: center;

    > * {
      transition: opacity .1s ease-out;
      cursor: pointer;
      opacity: .85;
      font-weight: 600;
    }

    > *:hover {
      opacity: 1;
    }
  }
}
</style>
