<template>
  <div class="landing">
    <base-page-transition mode="out-in">
      <the-about v-if="about" key="about"/>
    </base-page-transition>
    <base-page-transition mode="out-in">
      <the-privacy-policy v-if="privacy" key="privacy"/>
    </base-page-transition>
    <base-button class="landing__button" circle transparent @click.native="toggle()">
      <transition name="swap-trans">
        <div v-if="about || privacy">
          <chevron key="open"/>
        </div>
        <dots v-else key="closed"/>
      </transition>
    </base-button>
    <div class="landing__container">
      <h1>{{ name }}</h1>
      <p>Sing along to your favorite lyrics</p>

      <router-link :to="{ name: 'sync' }" tag="div">
        <base-button>
          <span class="text">OPEN THE APP</span>
        </base-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseButton from '@/components/BaseButton'
import TheAbout from '@/components/TheAbout'
import ThePrivacyPolicy from '@/components/ThePrivacyPolicy'
import BasePageTransition from '@/components/BasePageTransition'
import chevron from '@/assets/chevron.svg'
import dots from '@/assets/dots.svg'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
    TheAbout,
    ThePrivacyPolicy,
    BasePageTransition,
    chevron,
    dots,
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
  },
}
</script>

<style lang="scss" scoped>
.landing {
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

    .base-button {
      font-size: 1em;
    }

    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 3em;
    }

    @media only screen and (min-width: 640px) {
      top: 5%;

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
      }
    }
  }
}
</style>
