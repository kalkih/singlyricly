<template>
  <div class="welcome">
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <base-button class="welcome__about__button" circle @click.native="toggleAbout()">
      <transition name="swap-trans">
        <div v-if="about"> <chevron key="open"/></div>
        <span v-else key="closed">?</span>
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
import TheAbout from '@/components/TheAbout'
import BasePageTransition from '@/components/BasePageTransition'
import chevron from '@/assets/chevron.svg'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
    TheAbout,
    BasePageTransition,
    chevron,
  },
  data () {
    return {
      loading: false,
      error: '',
      errorMessage: '',
    }
  },
  computed: {
    ...mapState({
      url: state => state.auth.url,
      about: state => state.about,
    }),
    name: () => process.env.VUE_APP_NAME,
  },
  methods: {
    ...mapActions({
      getAuthURL: 'auth/fetchAuthUrl',
      toggleAbout: 'toggleAbout',
    }),
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
          this.errorMessage = 'Unable to contact Spotify'
          this.loading = false
        }
      }
    },
    redirect (url) {
      setTimeout(() => {
        window.location = url
      }, 250)
    },
  },
  created () {
    this.getAuthURL()
  },
}
</script>

<style lang="scss" scoped>
.welcome {
  &__about__button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99;

    > * {
      fill: $font-color;
      height: 1.2em;
      position: absolute;
    }

    > div {
      width: 1.2em;
    }

    svg {
      fill: $font-color;
      transform: rotate(-90deg);
      margin-top: 2px;
    }

    > span {
      font-size: 1.2em;
      font-weight: 700;
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
      font-weight: 600;
      font-size: 1em;
      height: auto;
      min-height: 3.6em;
      max-height: 6em;
      margin-bottom: 0px;
      margin-top: auto;
      width: 100%;
      max-width: 100%;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: .075em;
      line-height: 1.5em;
      border-radius: 360px;
      white-space: normal;
      transition:
        transform .15s,
        max-width .5s $easeInOutCubic,
        max-height .25s $easeInOutCubic .25s;

      > span {
        padding: 1em 1em;
        display: block;
        height: auto;
        transition: opacity .15s .35s;
      }

      &.--loading {
        max-width: 3.6em;
        max-height: 3.6em;
        transition:
          transform .15s,
          max-width .5s $easeInOutCubic,
          max-height .15s $easeInOutCubic 0s;

        .text {
          transition: opacity .15s;
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
        background-color: $font-color;
        border-radius: 100%;
        animation:
          spinner-pulse 1s infinite ease-in-out;
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
        font-weight: 600;
        width: auto;
      }
    }
  }
}
</style>
