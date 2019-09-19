<template>
  <base-page class="the-menu" @swipe-down="toggleMenu(false)">
    <div class="spacer"></div>
    <h1 @click="report()" :class="{'--disabled': !lyrics}">Report lyrics</h1>
    <h1 @click="toggleAbout()">About Us</h1>
    <h1 @click="togglePrivacyPolicy()">Privacy Policy</h1>
    <base-button @click.native="logout()">Sign out</base-button>
    <delay-bar hideTitle/>
  </base-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BasePage from './BasePage'
import BaseButton from './BaseButton'
import DelayBar from '@/components/DelayBar'
import menuNav from '@/mixins/menuNav'

export default {
  components: {
    BasePage,
    BaseButton,
    DelayBar,
  },
  mixins: [ menuNav ],
  computed: {
    ...mapState({
      menu: state => state.menu,
      lyrics: state => state.lyrics.found,
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
    report () {
      if (this.lyrics) {
        this.toggleReport()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.the-menu {

  .spacer {
    margin-bottom: auto;
    margin-top: 0;
    height: 25vh;
    width: 100%;

    @media only screen and (min-width: 640px) {
      height: 10vh;
    }
  }

  /deep/ .base-page__bg {
    background: $accent-color !important;
  }

  /deep/ .base-page__content {
    display: flex;
    align-items: center;
    flex-flow: column;
  }

  h1 {
    cursor: pointer;
    margin: .8em 0;
    -webkit-tap-highlight-color: transparent;
    font-weight: 600;
    transition: opacity .1s ease-out;
    // text-transform: lowercase;

    &:hover {
      opacity: .75;
    }

    &.--red {
      color: $red;
    }
    &.--disabled {
      cursor: default;
      opacity: .5;

      &:hover {
        opacity: .5;
      }
    }
  }

  .base-button {
    font-size: 1.1em;
    padding: 1.2em 3em;
    margin-top: 3.8em;

    @media only screen and (min-width: 640px) {
      margin-top: 1.2em;
    }

    &:before {
      background: $red;
    }
  }

  .delay-bar {
    font-size: 1.2em;
    margin-top: auto;
    margin-bottom: .05em;
    overflow: visible;
    justify-content: center;
    width: auto;
  }
}
</style>
