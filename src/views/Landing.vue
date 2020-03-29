<template>
  <div class="landing">
    <h1>Singlyricly</h1>
    <p>This is prerendered</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseButton from '@/components/BaseButton'
import BaseToast from '@/components/BaseToast'
import TheAbout from '@/components/TheAbout'
import ThePrivacyPolicy from '@/components/ThePrivacyPolicy'
import BasePageTransition from '@/components/BasePageTransition'

export default {
  name: 'Welcome',
  components: {
    BaseButton,
    BaseToast,
    TheAbout,
    ThePrivacyPolicy,
    BasePageTransition,
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
  },
}
</script>

<style lang="scss" scoped>
.landing {

}
</style>
