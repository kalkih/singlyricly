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
      <div class="landing__container__col">
        <div class="img"></div>
      </div>
      <div class="landing__container__col">
        <h1>{{ name }}</h1>
        <div class="desc">
          <p>Sing along to your favorite lyrics<p>
          <p>Singlyricly provides syncronized lyrics to your Spotify playback</p>
        </div>
        <router-link :to="{ name: 'sync' }" tag="div">
          <base-button>
            <span class="text">Start app</span>
          </base-button>
        </router-link>
      </div>
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
  display: flex;
  justify-content: center;

  &:after {
    content: '';
    position: fixed;
    height: 100%;
    width: 100%;
    background: var(--theme-color);
    // background-image: linear-gradient(to top, var(--theme-color), var(--theme-color--shade));
    background-image: linear-gradient(158deg, #6BEAD8 0%, #8E2DE2 100%);
    opacity: 1;
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
    top: 10%;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    max-width: 1200px;
    flex-flow: row;
    animation: fade .15s ease-out;
    height: calc(100% - 20%);
    padding: 0 40px;

    &__col {
      position: relative;
      flex: 1 1 auto;
      width: 100%;
      display: flex;
      flex-flow: column;
      height: 100%;
      align-items: start;
      justify-content: space-evenly;

      &:first-child {
        min-width: 50%;
        order: 2;
      }

      &:last-child {
        padding-bottom: 5%;
      }

      .img {
        position: absolute;
        left: -10%;
        background-image: url("/img/3d-preview.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        width: 120%;
        height: 100%;
      }
    }

    .base-button {
      font-size: 1.4em;
      text-transform: unset;
      font-weight: 400;
      padding: .8em 1.8em;

      span {
        letter-spacing: 0.05em;
      }
    }

    h1, p {
      margin: 0;
    }

    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 4em;
    }

    p {
      font-size: 1.4em;
      line-height: 1.8em;
    }

    .desc {
      // margin: 4em 0;
    }

    // @media only screen and (min-width: 640px) {
    //   top: 5%;

    //   h1 {
    //     font-size: 6em;
    //   }
    //   .base-button {
    //     font-size: 1.4em;
    //     margin-top: 10vh;
    //     letter-spacing: .15em;
    //     width: auto;
    //     height: 4em;
    //     padding: 1.2em 1.6em;
    //   }
    // }
  }
}
</style>
