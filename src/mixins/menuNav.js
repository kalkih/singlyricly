import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      menu: state => state.menu,
      about: state => state.about,
    }),
  },
  methods: {
    ...mapActions({
      toggleBase: 'toggleMenu',
      toggleAbout: 'toggleAbout',
    }),
    toggleMenu () {
      if (this.about) {
        this.toggleAbout(false)
      } else {
        this.toggleBase()
      }
    },
    closeMenu () {
      this.toggleBase(false)
      this.toggleAbout(false)
    },
    backMenu () {
      if (this.about) {
        this.toggleAbout(false)
      } else {
        this.toggleBase(false)
      }
    },
  },
}
