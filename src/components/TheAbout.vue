<template>
  <div class="the-about">
    <div class="the-about__bg"></div>
    <div class="the-about__content">
      <div></div>
      <h1>What's this?</h1>
      <p>Song lyrics synchronized with your Spotify playback</p>
      <h1>Contact</h1>
      <p>
        <a href="mailto:contact@example.com">contact@example.com</a>
      </p>
      <p class="--fine">All lyrics & artwork are property and copyright of their owners. All lyrics & artwork provided for educational purposes and personal use only</p>
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
  },
  computed: {
    ...mapState({
      about: state => state.about,
    }),
  },
  methods: {
    ...mapActions({
      toggle: 'toggleAbout',
    }),
  },
}
</script>

<style lang="scss" scoped>
.the-about {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 8;
  opacity: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;

  &__bg {
    background: darken($accent-color, 5%);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    border-radius: 0;
    width: 100%;
    height: 100vh;
    transform: translateY(0) translateZ(0);
  }

  &__content {
    font-size: .8em;
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    height: 100%;
    width: 100%;
    touch-action: pan-y;
    z-index: 10;
    overflow-y: scroll;

    @media only screen and (max-width: 320px) {
      font-size: .6em;
    }
    @media only screen and (min-width: 640px) {
      font-size: 1em;
    }

    > * {
      opacity: .75;
      font-weight: 600;
      transition: opacity .1s ease-out;
    }

    > h1 {
      opacity: 1;
      margin: .8em 0 0 0;
      -webkit-tap-highlight-color: transparent;

      &.--red {
        color: $red;
      }
    }

    .--fine {
      position: fixed;
      bottom: 0;
      opacity: .75;
      font-weight: 500;
      font-size: .8em;
      margin: 2em 60px;
      left: 0;
      right: 0;
    }

    > div:last-child {
      margin-top: auto;
      margin-bottom: 0;
      width: 100%;
    }

    > div:first-child {
      margin-top: 0;
      margin-bottom: auto;
      width: 100%;
    }
  }
}
</style>
