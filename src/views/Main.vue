<template>
  <div class="main">
    <base-page-transition mode="out-in">
      <the-acceptance v-if="!acceptance" key="acceptance"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-menu v-if="menu" key="menu"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-privacy-policy v-if="privacy" key="privacy"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-report v-if="report" key="report"/>
    </base-page-transition>
    <the-header/>
    <the-lyrics-screen/>
    <div class="the-controls" :class="{'--center': !delayedScrollStatus, '--offset': hasProgress && (synced || normal)}">
      <now-playing/>
      <transition name="switch-trans" mode="out-in">
        <base-button v-if="scrollOverride" :key="delayedScrollStatus" class="resume-button" @click="setScroll(true)">
          <span>RESUME</span>
        </base-button>
      </transition>
      <delay-bar v-if="synced" hideTitle/>
      <div class="spacer"/>
    </div>
    <the-menu-toggle v-if="acceptance || privacy" :class="{'--offset': hasProgress && (synced || normal)}" />
    <update-toast v-if="!$dev"/>
    <the-keys/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import TheLyricsScreen from '@/components/TheLyricsScreen'
import TheKeys from '@/components/TheKeys'
import NowPlaying from '@/components/NowPlaying'
import DelayBar from '@/components/DelayBar'
import BaseButton from '@/components/BaseButton'
import TheMenuToggle from '@/components/TheMenuToggle'
import TheAbout from '@/components/TheAbout'
import ThePrivacyPolicy from '@/components/ThePrivacyPolicy'
import TheReport from '@/components/TheReport'
import TheMenu from '@/components/TheMenu'
import TheAcceptance from '@/components/TheAcceptance'
import UpdateToast from '@/components/UpdateToast'
import BasePageTransition from '@/components/BasePageTransition'
import scrollHelper from '@/mixins/scrollHelper'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    TheLyricsScreen,
    TheKeys,
    NowPlaying,
    DelayBar,
    BaseButton,
    TheMenuToggle,
    TheAbout,
    ThePrivacyPolicy,
    TheReport,
    TheMenu,
    TheAcceptance,
    UpdateToast,
    BasePageTransition,
  },
  mixins: [scrollHelper],
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
      privacy: state => state.privacyPolicy,
      report: state => state.report,
      acceptance: state => state.user.acceptance,
      hasProgress (state) {
        return state.playback.track.length && state.playback.progress
      },
    }),
    ...mapGetters({
      hasPlayback: 'playback/hasPlayback',
    }),
    scrollOverride () {
      return this.synced && !this.delayedScrollStatus && !this.scroll
    },
  },
  methods: {
    ...mapActions({
      fetchUser: 'user/fetchUser',
      fetchPlayback: 'playback/fetchPlayback',
      fetchLyrics: 'lyrics/fetchLyrics',
      clearLyrics: 'lyrics/clearLyrics',
      setScroll: 'lyrics/setScroll',
    }),
    comparePlayback (newVal, oldVal) {
      return (newVal.artist !== oldVal.artist ||
        newVal.title !== oldVal.title)
    },
    setMetaTitle (title = undefined) {
      document.title = `${title ? `${title + ' - '}` : ''} ${process.env.VUE_APP_NAME}`
    },
  },
  watch: {
    track (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.comparePlayback(newVal, oldVal)) {
          this.clearLyrics()
          if (this.hasPlayback) {
            console.log('Fetching lyrics...')
            this.fetchLyrics(newVal)
            this.setMetaTitle(`${newVal.title} - ${newVal.artist}`)
          } else {
            this.setMetaTitle()
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
  beforeUnmount () {
    clearInterval(this.interval)
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/setup/_transitions';

.main {
  height: 100%;

  > .the-menu-toggle {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9;
    animation: fade-in .25s ease-out;
    --font-color: rgba(255,255,255,.95);
    transition: transform .25s var(--ease-io-cubic);

    @media only screen and (min-width: 640px) {
      display: none;
    }

    &.--offset {
      transform: translateY(-30px);
    }
  }

  .the-controls {
    display: flex;
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-top));
    left: 20px;
    right: 20px;
    justify-content: space-between;
    width: calc(100% - 40px);
    pointer-events: none;
    fill: var(--font-color);
    transition: transform .25s var(--ease-io-cubic);

    &.--offset {
      transform: translateY(-30px);
    }

    > * {
      pointer-events: auto;
    }

    .delay-bar, .now-playing {
      animation: fade-in .25s ease-out;
      --font-color: rgba(255,255,255,.95);
      --button-text-color: var(--font-color);
    }
    .delay-bar {
      display: none;
      flex-shrink: 0;
      margin-left: 10px;

      @media only screen and (min-width: 640px) {
        display: flex;
      }
    }
    .now-playing {
      --button-color: none;
      margin-right: 10px;
      overflow: visible;
    }
    .resume-button {
      font-size: 1em;
      padding: 1.2em 2.6em;
      margin: 0 10px;
    }
    .spacer {
      display: block;
      font-size: 1.4em;
      width: 2.6em;
      min-width: 2.6em;

      @media only screen and (min-width: 640px) {
        display: none;
      }
    }

    @media only screen and (min-width: 640px) {
      &.--center {
        .delay-bar,
        .now-playing {
          flex: 1;
        }
        .delay-bar {
          justify-content: flex-end;
        }
      }
    }
  }
  .update-toast {
    position: fixed;
    bottom: 0;
  }
}
</style>
