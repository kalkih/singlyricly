<template>
  <div class="the-menu" v-touch:swipe.bottom="() => toggleMenu()">
    <div class="the-menu__bg"></div>
    <div class="the-menu__content">
      <div></div>
      <h1 @click="toggleAbout()">About</h1>
      <h1>Report Lyrics</h1>
      <h1 @click="logout" class="--red">Sign out</h1>
      <delay-bar hideTitle/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DelayBar from '@/components/DelayBar'
import menuNav from '@/mixins/menuNav'

export default {
  components: {
    DelayBar,
  },
  mixins: [ menuNav ],
  computed: {
    ...mapState({
      menu: state => state.menu,
    }),
  },
  methods: {
    ...mapActions({
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
    transform: scale3d(50, 50, 50) translateZ(0);
    z-index: -1;

    @media only screen and (min-width: 640px) {
      bottom: unset;
      top: 0;
      right: 0;
      border-radius: 0;
      width: 100%;
      height: 100%;
      transform: translateY(0) translateZ(0);
    }
  }

  &__content {
    font-size: .8em;
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    height: 100%;
    overflow: scroll;
    touch-action: pan-y;
    transform: translateY(0) translateZ(0);

    @media only screen and (max-width: 320px) {
      font-size: .6em;
    }
    @media only screen and (min-width: 640px) {
      font-size: 1em;
    }

    > h1 {
      cursor: pointer;
      margin: .8em 0;
      -webkit-tap-highlight-color: transparent;
      font-weight: 600;
      transition: opacity .1s ease-out;
      // letter-spacing: .075em;
      // text-transform: uppercase;

      &:hover {
        opacity: .75;
      }

      &.--red {
        color: $red;
      }
    }

    .delay-bar {
      font-size: 1.2em;
      margin-top: auto;
      margin-bottom: .05em;
      overflow: visible;
    }

    > div:first-child {
      margin-bottom: auto;
      margin-top: 0;
      height: 20vh;
      width: 100%;

      @media only screen and (min-width: 640px) {
        height: 60px;
      }
    }
  }
}
</style>
