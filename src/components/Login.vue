<template>
  <div class="login"></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      setAccessToken: 'auth/setAccessToken',
      setRefreshToken: 'auth/setRefreshToken',
      setExpiryTime: 'auth/setExpiryTime',
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
      this.setExpiryTime(expires_in)
      this.$router.push('/')
    } else {
      this.$router.push('/welcome')
    }
  },
}
</script>
