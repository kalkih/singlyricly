<template>
  <div class="welcome">
    <h1>{{ name }}</h1>
    <base-button @click.native="login()">
      <span>Connect with Spotify</span>
    </base-button>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
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
    }),
    name: () => process.env.VUE_APP_NAME,
  },
  methods: {
    ...mapActions({
      getAuthURL: 'auth/fetchAuthUrl',
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
    position: absolute;
    top: 25%;
    bottom: 0;
    width: calc(100% - 2em);
    display: flex;
    align-items: center;
    flex-flow: column;
    margin: 1em;
    animation: fade .15s ease-out;

    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 3em;
      margin: 0;
    }

    .base-button {
      font-weight: 600;
      font-size: 1em;
      padding: 1.4em 1em;
      margin-bottom: 0px;
      margin-top: auto;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      height: auto;
      letter-spacing: .075em;
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
</style>
