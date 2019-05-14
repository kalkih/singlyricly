<template>
  <div class="main">
    <the-header/>
    <the-lyrics/>
    <delay-bar v-if="hasPlayback"/>
    <now-playing/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheLyrics from '@/components/TheLyrics'
import NowPlaying from '@/components/NowPlaying'
import DelayBar from '@/components/DelayBar'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    TheLyrics,
    NowPlaying,
    DelayBar,
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
    ...mapGetters({
      hasPlayback: 'playback/hasPlayback',
    }),
  },
  methods: {
    ...mapActions({
      fetchUser: 'user/fetchUser',
      fetchPlayback: 'playback/fetchPlayback',
      fetchLyrics: 'lyrics/fetchLyrics',
      clearLyrics: 'lyrics/clearLyrics',
    }),
    comparePlayback (newVal, oldVal) {
      return (newVal.artist !== oldVal.artist ||
        newVal.title !== oldVal.title)
    },
  },
  watch: {
    track (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.comparePlayback(newVal, oldVal)) {
          this.clearLyrics()
          if (this.hasPlayback) {
            this.fetchLyrics(newVal)
            console.log('fetching lyrics...')
          }
        }
      }
    },
  },
  created () {
    if (!this.user) {
      this.fetchUser()
    }
    this.fetchPlayback()
    this.interval = setInterval(this.fetchPlayback, 5000)
  },
  destroyed () {
    clearInterval(this.interval)
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
  .delay-bar {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
}
</style>
