<template>
  <base-page class="the-report" @swipe-down="toggle(false)">
    <div></div>
    <h1 class="title">report lyrics</h1>
    <transition name="swap-trans" mode="out-in">
      <base-button accent v-if="lyrics" @click.native="report(LYRICS)">Wrong lyrics</base-button>
    </transition>
    <transition name="swap-trans" mode="out-in">
      <base-button accent v-if="synced" @click.native="report(SYNC)">Out of sync</base-button>
    </transition>
    <base-page-transition mode="out-in">
      <base-page class="nested" v-if="step === STEP.COMPLETE" @swipe-down="closeNested()">
        <div></div>
        <h1 class="title">Thank you, that's it!</h1>
        <base-button accent @click.native="correct">{{ ACTION_TEXT[type]}}</base-button>
        <base-button accent @click.native="exit">Return to app</base-button>
        <div></div>
      </base-page>
    </base-page-transition>
    <div></div>
  </base-page>
</template>

<script>
import BasePageTransition from './BasePageTransition'
import BasePage from './BasePage'
import BaseButton from './BaseButton'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    BasePage,
    BasePageTransition,
    BaseButton,
  },
  data () {
    return {
      step: 0,
      type: 0,
      LYRICS: 0,
      SYNC: 1,
      STEP: {
        INITIAL: 0,
        COMPLETE: 1,
      },
      ACTION_TEXT: [
        'edit lyrics',
        'resync lyrics',
      ],
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
    }),
    ...mapGetters({
      lyrics: 'lyrics/hasNormal',
      synced: 'lyrics/hasSynced',
    }),
  },
  methods: {
    ...mapActions({
      toggle: 'toggleReport',
      toggleMenu: 'toggleMenu',
      closeNested: 'closeSecondary',
    }),
    report (type) {
      this.step = this.STEP.COMPLETE
      this.type = type
    },
    exit () {
      this.closeNested(false)
      this.toggleMenu(false)
    },
    correct () {
      this.exit()
      if (this.type === this.LYRICS) {
        this.$router.push('/add')
      } else {
        this.$router.push('/sync')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.the-report {
  align-items: center;
  font-size: 1em;

  .title {
    margin: 0 0 1em 0;
    font-weight: 700;
    letter-spacing: .075em;
  }
  .base-button {
    font-size: 1.2em;
    margin-top: 2em;
    max-width: 300px;
    width: 100%;
  }
  .nested {
    font-size: 1.2em;

    @media only screen and (min-width: 640px) {
      font-size: 1em;
    }
  }
}
</style>
