<template>
  <div class="main">
    <the-menu-transition mode="out-in">
      <the-menu v-if="menu" key="menu"/>
    </the-menu-transition>
    <the-header/>
    <the-lyrics/>
    <delay-bar v-if="hasPlayback"/>
    <the-menu-toggle/>
    <now-playing/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheLyrics from '@/components/TheLyrics'
import NowPlaying from '@/components/NowPlaying'
import DelayBar from '@/components/DelayBar'
import TheMenuToggle from '@/components/TheMenuToggle'
import TheMenu from '@/components/TheMenu'
import TheMenuTransition from '@/components/TheMenuTransition'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    TheLyrics,
    NowPlaying,
    DelayBar,
    TheMenuToggle,
    TheMenu,
    TheMenuTransition,
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
      menu: state => state.menu,
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

    @media only screen and (min-width: 640px) {
      display: flex;
    }
  }
  .the-menu-toggle {
    display: block;
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 9;

    @media only screen and (min-width: 640px) {
      display: none;
    }
  }
}
</style>
