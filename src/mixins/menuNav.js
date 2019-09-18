import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      menu: state => state.menu,
    }),
    ...mapGetters({
      nestedNav: 'nestedNav',
    }),
    isMenuOpen () {
      return this.menu || this.nestedNav
    },
  },
  methods: {
    ...mapActions({
      toggleBase: 'toggleMenu',
      closeSecondary: 'closeSecondary',
      toggleAbout: 'toggleAbout',
      togglePrivacyPolicy: 'togglePrivacyPolicy',
      toggleReport: 'toggleReport',
    }),
    toggleMenu () {
      if (this.nestedNav) {
        this.closeSecondary()
      } else {
        this.toggleBase()
      }
    },
    closeMenu () {
      this.toggleBase(false)
      this.closeSecondary()
    },
    backMenu () {
      if (this.nestedNav) {
        this.closeSecondary()
      } else {
        this.toggleBase(false)
      }
    },
  },
}
