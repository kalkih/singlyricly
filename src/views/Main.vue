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
  data () {
    return {
      interval: null,
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      user: state => state.user.name,
    }),
  },
  methods: {
    ...mapActions({
      fetchUser: 'user/fetchUser',
      fetchPlayback: 'playback/fetchPlayback',
      fetchLyrics: 'lyrics/fetchLyrics',
    }),
    comparePlayback (newVal, oldVal) {
      return newVal.artist !== oldVal.artist || newVal.title !== oldVal.title
    },
  },
  watch: {
    track (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.comparePlayback(newVal, oldVal)) {
          this.fetchLyrics(newVal)
        }
      }
    },
  },
  destroyed () {
    clearInterval(this.interval)
  },
  created () {
    if (!this.user) {
      this.fetchUser()
    }
    this.fetchPlayback()
    this.interval = setInterval(this.fetchPlayback, 5000)
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
