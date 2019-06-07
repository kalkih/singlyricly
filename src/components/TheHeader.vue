<template>
  <div class="the-header">
    <h1 class="the-header__title" @click="closeMenu">{{ title }}</h1>
    <base-button
      v-if="username"
      class="the-header__settings"
      @click.native="toggleMenu">
      <span>{{ text }}</span>
      <transition name="swap-trans">
        <close v-if="menu" key="open-menu"/>
        <hamburger v-else key="closed-menu"/>
      </transition>
    </base-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseButton from './BaseButton'
import menuNav from '@/mixins/menuNav'
import close from '@/assets/close.svg'
import hamburger from '@/assets/hamburger.svg'

export default {
  components: {
    BaseButton,
    close,
    hamburger,
  },
  mixins: [ menuNav ],
  computed: {
    ...mapState({
      username: state => state.user.name,
      menu: state => state.menu,
    }),
    title: () => process.env.VUE_APP_NAME,
    text () {
      return 'Hey ' + this.username
    },
  },
}
</script>

<style lang="scss" scoped>
.the-header {
  display: flex;
  flex-flow: row;
  align-items: top;
  justify-content: center;
  padding: 10px 20px;
  position: absolute;
  width: 100%;
  z-index: 10;
  pointer-events: none;
  touch-action: pan-y;

  @media only screen and (min-width: 640px) {
    justify-content: space-between;
    padding: 20px;

    .the-header__title {
      font-size: 2.4em;
      line-height: 1em;
    }

    .the-header__settings {
      display: flex;
    }
  }

  &__settings {
    display: none;
    animation: fade-in-top .25s ease-out;
    padding-right: 2.4em;
    padding-left: .8em;
    pointer-events: auto;

    svg {
      fill: $font-color;
      height: 1em;
      position: absolute;
      right: .8em;
    }
  }

  &__title {
    font-family: 'Pacifico', cursive;
    font-weight: 500;
    margin: 0;
    font-size: 2em;
    transition: opacity .1s;
    cursor: pointer;
    pointer-events: auto;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      opacity: .75;
    }
  }

}
</style>
