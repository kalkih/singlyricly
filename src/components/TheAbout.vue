<template>
  <base-page class="the-about" @swipe-down="toggle(false)">
    <div></div>
    <h2>What's this?</h2>
    <p>Singlyricly is a community based app which allow users to see real time song lyrics synchronized with their Spotify playback. Real time lyrics are accessible regardless of playback device, play music through Sonos, Chromecast or Spotify Connect, and the lyrics will always show up in the app as long as there's a connected Spotify account.</p>
    <h2>Contact</h2>
    <p>
      <a :href="`mailto:${contact}`">{{ contact }}</a>
    </p>
    <h2>Source</h2>
    <p>
      <a :href="source">Github</a>
    </p>
    <p class="--fine">All lyrics & artwork are property and copyright of their owners. All lyrics & artwork provided for educational purposes and personal use only</p>
    <div></div>
  </base-page>
</template>

<script>
import BasePage from './BasePage'
import { mapActions } from 'vuex'

export default {
  components: {
    BasePage,
  },
  computed: {
    contact: () => process.env.VUE_APP_CONTACT,
    source: () => process.env.VUE_APP_SOURCE,
  },
  methods: {
    ...mapActions({
      toggle: 'toggleAbout',
    }),
  },
}
</script>

<style lang="scss" scoped>
a {
  color: #fff;
  transition: opacity .1s;
  padding: .6em 1em;
  border-radius: 4em;

  &:hover {
    background: rgba(255,255,255,.25);
  }
}
p {
  max-width: 1200px;
}
</style>
