<template>
  <div class="welcome">
    <h1>{{ name }}</h1>
    <base-button @click.native="login()">Connect with Spotify</base-button>
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
    bottom: 5%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-flow: column;

    h1 {
      font-family: 'Pacifico', cursive;
      font-weight: 400;
      font-size: 3em;
      margin: 0;
    }

    .base-button {
      font-size: 1.4em;
      font-weight: 500;
      padding: .5em 1em;
      margin-bottom: 0px;
      margin-top: auto;
    }

    @media only screen and (min-width: 640px) {
      h1 {
        font-size: 6em;
      }
      .base-button {
        font-size: 1.6em;
        margin-top: 10vh;
      }
    }
  }
</style>
