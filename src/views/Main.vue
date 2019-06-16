<template>
  <div class="main">
    <the-menu-transition mode="out-in">
      <the-menu v-if="menu" key="menu"/>
    </the-menu-transition>
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <the-header/>
    <the-lyrics-screen/>
    <delay-bar v-if="synced" hideTitle/>
    <the-menu-toggle/>
    <now-playing/>
    <the-keys/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheLyricsScreen from '@/components/TheLyricsScreen'
import TheKeys from '@/components/TheKeys'
import NowPlaying from '@/components/NowPlaying'
import DelayBar from '@/components/DelayBar'
import TheMenuToggle from '@/components/TheMenuToggle'
import TheAbout from '@/components/TheAbout'
import TheMenu from '@/components/TheMenu'
import TheMenuTransition from '@/components/TheMenuTransition'
import BasePageTransition from '@/components/BasePageTransition'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    TheLyricsScreen,
    TheKeys,
    NowPlaying,
    DelayBar,
    TheMenuToggle,
    TheAbout,
    TheMenu,
    TheMenuTransition,
    BasePageTransition,
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
      about: state => state.about,
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
            console.log('Fetching lyrics...')
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
    animation: fade-in .25s ease-out;
  }
  .delay-bar {
    display: none;
    position: fixed;
    right: 20px;
    bottom: 20px;
    animation: fade-in .25s ease-out;

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
    animation: fade-in .25s ease-out;

    @media only screen and (min-width: 640px) {
      display: none;
    }
  }
}
</style>
