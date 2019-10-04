<template>
  <base-page class="the-acceptance">
    <div></div>
    <h1 class="title">Just one last boring thing...</h1>
    <p>"I've read and accept the <span class="bold" @click="togglePrivacyPolicy">Privacy Policy</span>."</p>
    <base-button @click.native="accept()">Yes</base-button>
    <base-button accent @click.native="decline()">Sign out</base-button>
    <div></div>
  </base-page>
</template>

<script>
import BasePage from './BasePage'
import BaseButton from './BaseButton'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    BasePage,
    BaseButton,
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
    }),
  },
  methods: {
    ...mapActions({
      resetState: 'reset',
      setAcceptance: 'user/setAcceptance',
      togglePrivacyPolicy: 'togglePrivacyPolicy',
    }),
    accept () {
      this.setAcceptance(true)
    },
    decline () {
      this.resetState()
      this.$router.push('welcome')
    },
  },
}
</script>

<style lang="scss" scoped>
.the-acceptance {
  align-items: center;
  font-size: 1em;

  p {
    font-size: 1.2em;
    margin-bottom: 2em;
  }

  .title {
    margin: 0 0 1em 0;
    font-weight: 600;
    letter-spacing: .075em;
    line-height: 1.5em;
  }
  .base-button {
    font-size: 1.2em;
    margin-top: 2em;
    max-width: 300px;
    width: 100%;
  }
  .bold {
    font-weight: 700;
    color: white;
    cursor: pointer;

    &:hover {
      opacity: .85;
    }
  }
}
</style>
