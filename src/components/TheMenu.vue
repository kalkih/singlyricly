<template>
  <base-page class="the-menu" @swipe-down="toggleMenu(false)">
    <div class="spacer"></div>
    <transition name="swap-trans" mode="out-in">
      <div class="contribute-buttons" v-if="!fetching && playback" :key="fetching">
        <base-button @click.native="add()">
          <span>{{ lyricsButtonText }}</span>
          <span>lyrics</span>
        </base-button>
        <base-button @click.native="sync()" :class="{'--disabled': !lyrics}">
          <span>{{ syncedButtonText }}</span>
          <span>sync</span>
        </base-button>
      </div>
      <div v-else class="contribute-buttons" key="default"></div>
    </transition>
    <h1 @click="report()" :class="{'--disabled': !lyrics}">Report lyrics</h1>
    <h1 @click="toggleAbout()">About Us</h1>
    <h1 @click="togglePrivacyPolicy()">Privacy Policy</h1>
    <base-button class="--red" accent @click.native="logout()">Sign out</base-button>
    <delay-bar hideTitle/>
  </base-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
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
  data () {
    return {
      BUTTON_TEXT: {
        ADD: 'Add',
        IMPROVE: 'Improve',
      },
    }
  },
  computed: {
    ...mapState({
      menu: state => state.menu,
      fetching: state => state.lyrics.searching,
    }),
    ...mapGetters({
      lyrics: 'lyrics/hasNormal',
      synced: 'lyrics/hasSynced',
      playback: 'playback/hasPlayback',
    }),
    lyricsButtonText () {
      return this.lyrics ? this.BUTTON_TEXT['IMPROVE'] : this.BUTTON_TEXT['ADD']
    },
    syncedButtonText () {
      return this.synced ? this.BUTTON_TEXT['IMPROVE'] : this.BUTTON_TEXT['ADD']
    },
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
    sync () {
      this.closeMenu()
      this.$router.push('sync')
    },
    add () {
      this.closeMenu()
      this.$router.push('add')
    },
  },
}
</script>

<style lang="scss" scoped>
.the-menu {

  ::v-deep .base-page__bg {
    > div {
      opacity: .75;
    }
  }

  ::v-deep .base-page__content {
    display: flex;
    align-items: center;
    flex-flow: column;
  }

  .spacer {
    margin-bottom: auto;
    margin-top: 0;
    height: 30vh;
    width: 100%;
    min-height: 60px;

    @media only screen and (min-width: 640px) {
      height: 20vh;
    }
    @media only screen and (max-height: 640px) {
      height: 20vh;
    }
  }

  .contribute-buttons {
    display: flex;
    align-items: space-between;
    margin-bottom: 1.6em;
    max-width: 500px;
    width: 100%;
    min-height: 6em;

    > :nth-child(1) {
      margin-right: 1em;
    }

    > :nth-child(2) {
      margin-left: 1em;
    }

    .base-button {
      font-size: 1em;
      display: flex;
      flex-flow: column;
      width: auto;

      > :nth-child(2) {
        margin: .15em 0 0 0;
      }
      &.--disabled {
        cursor: default;
        pointer-events: none;
        opacity: .25;
      }
    }
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
      color: var(--color-red);
    }

    &.--disabled {
      opacity: .25;
      cursor: default;
      pointer-events: none;
    }
  }

  .base-button {
    font-size: 1.1em;
    padding: 1.2em 3em;
    margin: auto;
    min-height: 3em;

    @media only screen and (min-width: 640px) {
      margin-top: 1.8em;
    }
  }

  .delay-bar {
    font-size: 1.2em;
    margin-top: 0;
    margin-bottom: .05em;
    justify-content: center;
    width: auto;
    color: var(--font-color);
    fill: var(--font-color);

    &:before {
      background: transparent;
    }
  }
}
</style>
