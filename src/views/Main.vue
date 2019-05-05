<template>
  <div class="main">
    <the-header/>
    <the-lyrics></the-lyrics>
    <now-playing/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheLyrics from '@/components/TheLyrics'
import NowPlaying from '@/components/NowPlaying'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TheHeader,
    TheLyrics,
    NowPlaying,
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
    }),
  },
  methods: {
    ...mapActions({
      fetchUser: 'user/fetchUser',
      fetchPlayback: 'playback/fetchPlayback',
    }),
  },
  created () {
    this.fetchUser()
    this.fetchPlayback()
  },
}
</script>

<style lang="scss" scoped>
.main {
  .now-playing {
    position: fixed;
    left: 20px;
    bottom: 20px;
  }
}
</style>
