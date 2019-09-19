<template>
  <base-page class="the-menu" @swipe-down="toggleMenu(false)">
    <div class="spacer"></div>
    <h1 @click="toggleAbout()">About</h1>
    <h1 @click="report()" :class="{'--disabled': !lyrics}">Report lyrics</h1>
    <h1 @click="togglePrivacyPolicy()">Privacy Policy</h1>
    <h1 @click="logout" class="--red">Sign out</h1>
    <delay-bar hideTitle/>
  </base-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BasePage from './BasePage'
import DelayBar from '@/components/DelayBar'
import menuNav from '@/mixins/menuNav'

export default {
  components: {
    BasePage,
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
    height: 20vh;
    width: 100%;
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

  .delay-bar {
    font-size: 1.2em;
    margin-top: auto;
    margin-bottom: .05em;
    overflow: visible;
    justify-content: center;
    width: auto;
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
</style>
