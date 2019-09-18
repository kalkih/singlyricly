<template>
  <base-page class="the-report" @swipe-down="toggle(false)">
    <div></div>
    <h1 class="title">report lyrics</h1>
    <base-button @click.native="report">Wrong lyrics</base-button>
    <base-button @click.native="report">Out of sync</base-button>
    <base-page-transition mode="out-in">
      <base-page class="nested" v-if="step === 2" @swipe-down="closeNested()">
        <div></div>
        <h1 class="title">Thank you, that's it!</h1>
        <base-button>Correct lyrics</base-button>
        <base-button @click.native="exit">Return to app</base-button>
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
import { mapActions } from 'vuex'

export default {
  components: {
    BasePage,
    BasePageTransition,
    BaseButton,
  },
  data () {
    return {
      step: 0,
    }
  },
  methods: {
    ...mapActions({
      toggle: 'toggleReport',
      toggleMenu: 'toggleMenu',
      closeNested: 'closeSecondary',
    }),
    report () {
      this.step = 2
    },
    exit () {
      this.closeNested(false)
      this.toggleMenu(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.the-report {
  align-items: center;
  font-size: 1em;

  .title {
    margin: 0 0 2em 0;
    font-weight: 700;
    letter-spacing: .075em;
  }
  .base-button {
    font-size: 1.2em;
    padding: 1.2em 2em;
    height: auto;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .15em;
    margin-top: 2em;
    max-width: 300px;
    width: 100%;
  }
  .nested {
    font-size: 1.2em;
  }
}
</style>
