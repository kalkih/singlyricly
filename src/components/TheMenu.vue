<template>
  <base-page class="the-menu" @swipe-down="toggleMenu(false)">
    <div class="spacer"></div>
    <transition name="swap-trans" mode="out-in">
      <div class="contribute-buttons" v-if="!fetching && playback" :key="fetching">
        <base-button accent @click="add()">
          <span>{{ lyricsButtonText }}</span>
          <span>lyrics</span>
        </base-button>
        <base-button accent @click="sync()" :disabled="!lyrics">
          <span>{{ syncedButtonText }}</span>
          <span>sync</span>
        </base-button>
      </div>
      <div v-else class="contribute-buttons" key="default"></div>
    </transition>
    <div class="menu-items">
      <base-button transparent noripple :disabled="!lyrics" @click="report()">Report lyrics</base-button>
      <base-button transparent noripple @click="toggleAbout()">About Us</base-button>
      <base-button transparent noripple @click="togglePrivacyPolicy()">Privacy Policy</base-button>
    </div>
    <base-button accent @click="logout()">Sign out</base-button>
    <wake-lock-toggle />
    <delay-bar hideTitle/>
  </base-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import menuNav from '@/mixins/menuNav'
import BasePage from './BasePage'
import BaseButton from './BaseButton'
import DelayBar from '@/components/DelayBar'
import WakeLockToggle from '@/components/WakeLockToggle'

export default {
  components: {
    BasePage,
    BaseButton,
    DelayBar,
    WakeLockToggle,
  },
  mixins: [menuNav],
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
      return this.lyrics ? this.BUTTON_TEXT.IMPROVE : this.BUTTON_TEXT.ADD
    },
    syncedButtonText () {
      return this.synced ? this.BUTTON_TEXT.IMPROVE : this.BUTTON_TEXT.ADD
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

  ::v-deep(.base-page__bg) {
    > div {
      opacity: .75;
    }
  }

  ::v-deep(.base-page__content) {
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
    min-height: 7em;

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
      height: 4.6em;
      overflow: visible;

      > :nth-child(2) {
        margin: .15em 0 0 0;
      }
    }
  }

  .base-button {
    font-size: 1.1em;
    padding: 1.2em 3em;
    margin: auto;
    min-height: 3em;
    margin-top: 1.8em;
    margin-bottom: 1.8em;

    @media only screen and (min-width: 640px) {
      margin-top: 1.8em;
    }
  }

  .delay-bar {
    font-size: 1.2em;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 3.9em;
    color: var(--font-color);
    fill: var(--font-color);
    display: flex;
    margin-top: 1.2em !important;
    overflow: visible;

    &:before {
      background: transparent;
    }
  }

  .menu-items {
    .base-button {
      margin: 0;
      font-weight: 600;
      font-size: 2em;
      text-transform: capitalize;
      padding: 0 1em;
      letter-spacing: unset;
    }
  }
}
</style>
