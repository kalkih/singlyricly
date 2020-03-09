<template>
  <div class="welcome" :class="{'--loading': loading, '--loaded': loaded }">
    <transition name="fade">
      <base-toast v-if="error" @click.native="reset()">
        <span>{{ errorMessage }}</span>
      </base-toast>
    </transition>
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-privacy-policy v-if="privacy" key="privacy"/>
    </base-page-transition>
    <base-button class="welcome__button" circle transparent @click.native="toggle()">
      <transition name="swap-trans">
        <div v-if="about || privacy">
          <chevron key="open"/>
        </div>
        <dots v-else key="closed"/>
      </transition>
    </base-button>
    <div class="welcome__container">
      <h1>{{ name }}</h1>
      <base-button @click.native="login()" :class="{'--loading': loading}">
        <span class="text">Connect with Spotify</span>
        <div class="spinner-container" v-if="loading">
          <div class="spinner-pulse"></div>
        </div>
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import BaseToast from '@/components/BaseToast'
import TheAbout from '@/components/TheAbout'
import ThePrivacyPolicy from '@/components/ThePrivacyPolicy'
import BasePageTransition from '@/components/BasePageTransition'
import chevron from '@/assets/chevron.svg'
import dots from '@/assets/dots.svg'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
    BaseToast,
    TheAbout,
    ThePrivacyPolicy,
    BasePageTransition,
    chevron,
    dots,
  },
  data () {
    return {
      loading: false,
      loaded: false,
      error: '',
      errorMessage: '',
    }
  },
  computed: {
    ...mapState({
      url: state => state.auth.url,
      about: state => state.about,
      privacy: state => state.privacyPolicy,
    }),
    name: () => process.env.VUE_APP_NAME,
  },
  methods: {
    ...mapActions({
      getAuthURL: 'auth/fetchAuthUrl',
      setAuthURL: 'auth/setAuthURL',
      toggleMenu: 'closeSecondary',
      toggleAbout: 'toggleAbout',
    }),
    toggle () {
      if (this.about || this.privacy) {
        this.toggleMenu()
      } else {
        this.toggleAbout(true)
      }
    },
    async login () {
      if (this.loading) return
      this.loading = !(this.loading)
      if (this.url) {
        this.redirect(this.url)
      } else {
        const url = await this.getAuthURL()
        if (url) {
          this.redirect(url)
        } else {
          this.error = 3000
          this.errorMessage = 'Unable to connect, check your internet connection'
          this.loading = false
        }
      }
    },
    reset () {
      this.error = ''
      this.errorMessage = ''
    },
    redirect (url) {
      setTimeout(() => {
        window.location = url
      }, 250)
    },
  },
  created () {
    this.setAuthURL('')
  },
  mounted () {
    setTimeout(() => {
      this.loaded = true
    }, 250)
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  height: 100%;
  &:after {
    content: '';
    position: fixed;
    height: 100%;
    width: 100%;
    background: var(--theme-color);
    background-image: linear-gradient(to top, var(--theme-color), var(--theme-color--shade));
    opacity: .6;
    z-index: -1;
  }
  &:before {
    position: fixed;
    content: '';
    background: url("/img/x-2.jpg") top center/cover;
    height: 100%;
    width: 100%;
    opacity: .75;
    z-index: -1;
    transform: scale(1);
    transition: transform 2.5s;
  }

  &.--loaded {
    &:before {
      transform: scale(1.1);
    }
  }

  &.--loading {
    &:before {
      transform: scale(1.35);
    }
  }

  &__button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99;

    > div {
      width: 1.2em;
      height: 1.2em;
      position: absolute;
    }
    .svg-dots {
      height: 1.4em;
    }
    .svg-chevron {
      transform: rotate(-90deg);
    }
  }
  &__container {
    position: absolute;
    top: 25%;
    bottom: 0;
    width: 100%;
    padding: 1em;
    display: flex;
    align-items: center;
    flex-flow: column;
    animation: fade .15s ease-out;
    overflow: hidden;

    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 3em;
      margin: 0;
    }

    .base-button {
      color: rgba(0,0,0,0.65);
      font-size: 1em;
      height: auto;
      min-height: 3.6em;
      max-height: 6em;
      margin-bottom: 0px;
      margin-top: auto;
      width: 100%;
      height: 4.6em;
      max-width: 100%;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: .125em;
      line-height: 1.5em;
      border-radius: 360px;
      white-space: normal;
      transition:
        transform .15s,
        max-width .5s ease,
        max-height .25s ease .25s;

      &:before {
        transition: opacity .15s;
      }

      > span {
        padding: 1em 0;
        display: block;
        height: auto;
        transition: opacity .15s .35s;
      }

      &.--loading {
        max-width: 4.6em;
        max-height: 4.6em;
        transition:
          transform .15s,
          max-width .5s ease,
          max-height .15s ease 0s;

        &:before {
          opacity: .2;
          transition: opacity .5s .25s;
        }

        .text {
          transition: opacity .1s;
          opacity: 0;
        }
      }

      .spinner-container {
        animation: reveal-in .5s forwards .25s;
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
      }
      .spinner-pulse {
        width: 100%;
        height: 100%;
        margin: 0;
        background-color: var(--font-color);
        border-radius: 100%;
        animation: spinner-pulse 1s infinite ease-in-out;
      }

      @keyframes reveal-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @keyframes spinner-pulse {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1.0);
          opacity: 0;
        }
      }
    }

    @media only screen and (min-width: 640px) {
      bottom: 5%;

      h1 {
        font-size: 6em;
      }
      .base-button {
        font-size: 1.4em;
        margin-top: 10vh;
        letter-spacing: .15em;
        width: auto;
        height: 4em;
        padding: 1.2em 1.6em;

        &.--loading {
          max-width: 4em;
        }
      }
    }
  }
  .fade-leave-to {
    transition: transform .25s, opacity .25s;
    transform: translateY(-100px);
    opacity: 0;
  }
}
</style>
