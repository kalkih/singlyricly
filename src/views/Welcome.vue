<template>
  <div class="welcome">
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <base-button class="welcome__about__button" circle @click.native="toggleAbout()">
      <transition name="swap-trans">
        <close v-if="about" key="open"/>
        <span v-else key="closed">?</span>
      </transition>
    </base-button>
    <div class="welcome__container">
      <h1>{{ name }}</h1>
      <base-button @click.native="login()">
        <span>Connect with Spotify</span>
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import TheAbout from '@/components/TheAbout'
import BasePageTransition from '@/components/BasePageTransition'
import close from '@/assets/close.svg'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
    TheAbout,
    BasePageTransition,
    close,
  },
  data () {
    return {
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
      if (this.url) {
        window.location = this.url
      } else {
        const url = await this.getAuthURL()
        if (url) {
          window.location = url
        } else {
          this.error = 3000
          this.errorMessage = 'Unable to contact Spotify'
        }
      }
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
      padding: 1.3em 1em;
      margin-bottom: 0px;
      margin-top: auto;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      height: auto;
      letter-spacing: .075em;
      line-height: 1.5em;
      border-radius: 360px;
    }

    @media only screen and (min-width: 640px) {
      bottom: 5%;

      h1 {
        font-size: 6em;
      }
      .base-button {
        font-size: 1.4em;
        margin-top: 10vh;
        width: auto;
        padding: 1em 2em;
      }
    }
  }
}
</style>
