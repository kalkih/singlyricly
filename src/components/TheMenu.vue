<template>
  <div class="the-menu">
    <div class="the-menu__bg"></div>
    <div class="the-menu__content">
      <div></div>
      <h1>About</h1>
      <h1>Something</h1>
      <h1>Something else</h1>
      <h1 @click="logout" class="--red">Sign out</h1>
      <delay-bar hideTitle/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DelayBar from '@/components/DelayBar'

export default {
  components: {
    DelayBar,
  },
  computed: {
    ...mapState({
      menu: state => state.menu,
    }),
  },
  methods: {
    ...mapActions({
      toggle: 'toggleMenu',
      resetState: 'reset',
    }),
    logout () {
      this.resetState()
      this.$router.push('welcome')
    },
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
    text-align: center;
    padding: 20px;
    height: 100%;

    @media only screen and (max-width: 320px) {
      font-size: .8em;
    }

    > * {
      opacity: .85;
      font-weight: 600;
      transition: opacity .1s ease-out;

      &:hover {
        opacity: 1;
      }
    }

    > h1 {
      cursor: pointer;

      &.--red {
        color: $red;
      }
    }

    .delay-bar {
      font-size: 1em;
      margin-top: auto;
    }

    > div:first-child {
      margin-top: 25vh;
      margin-bottom: auto;
    }
  }
}
</style>
