<template>
  <div class="the-header" :class="{ '--home': home }">
    <h1 class="the-header__title" @click="reset">{{ title }}</h1>
    <base-button
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
  data () {
    return {
      home: false,
    }
  },
  computed: {
    ...mapState({
      alias: state => state.user.alias,
      menu: state => state.menu,
    }),
    title: () => process.env.VUE_APP_NAME,
    text () {
      if (this.alias) {
        return `Hey ${this.alias}`
      } else {
        return 'Menu'
      }
    },
  },
  methods: {
    reset () {
      this.closeMenu()
      this.$router.push('/')
    },
  },
  watch: {
    '$route.name': {
      handler (name) {
        if (name !== 'main') {
          this.home = false
        } else {
          this.home = true
        }
      },
      deep: true,
      immediate: true,
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
    padding: 20px;

    .the-header__title {
      font-size: 2.2em;
      line-height: 1.4em;
    }
  }

  &.--home {
    @media only screen and (min-width: 640px) {
      justify-content: space-between;

      .the-header__settings {
        display: flex;
      }
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
    opacity: 1;

    &:hover {
      opacity: .75;
    }
  }

}
</style>
