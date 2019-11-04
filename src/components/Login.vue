<template>
  <div class="login">
    <h1>Redirecting...</h1>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      setAccessToken: 'auth/setAccessToken',
      setRefreshToken: 'auth/setRefreshToken',
      setExpiryTime: 'auth/setExpiryTime',
      setTtl: 'auth/setTtl',
      fetchUser: 'user/fetchUser',
    }),
  },
  computed: {
    ...mapState({
      username: state => state.user.username,
    }),
  },
  created () {
    // eslint-disable-next-line camelcase
    const { access_token, refresh_token, expires_in, error } = this.$route.query
    if (!error) {
      this.setAccessToken(access_token)
      this.setRefreshToken(refresh_token)
      this.setTtl(expires_in)
      this.setExpiryTime()
      this.fetchUser()
      this.$router.push('/')
    } else {
      this.$router.push('/welcome')
    }
  },
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
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
    animation: anim-bg 60s ease forwards;
    z-index: -1;

    @keyframes anim-bg {
      0% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(2);
      }
    }
  }
  h1 {
    align-self: center;
  }
}
</style>
