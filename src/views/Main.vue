<template>
  <div class="main">
    <the-header/>
    <the-lyrics :updatePlayback="fetchPlayback"></the-lyrics>
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
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
    }),
  },
  methods: {
    ...mapActions({
      fetchUser: 'user/fetchUser',
      fetchPlayback: 'playback/fetchPlayback',
      fetchLyrics: 'lyrics/fetchLyrics',
    }),
  },
  created () {
    this.fetchUser()
    this.fetchPlayback()
  },
  watch: {
    track (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchLyrics(newVal)
      }
    },
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
