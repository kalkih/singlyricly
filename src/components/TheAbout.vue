<template>
  <base-page class="the-about" v-touch:swipe.bottom="() => toggleAbout(false)">
    <div></div>
    <h2>What's this?</h2>
    <p>Song lyrics synchronized with your Spotify playback</p>
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
      toggleAbout: 'toggleAbout',
    }),
  },
}
</script>

<style lang="scss" scoped>
</style>
