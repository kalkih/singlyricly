import { mapState } from 'vuex'

export default {
  data () {
    return {
      timeout: null,
      delayedScrollStatus: true,
    }
  },
  computed: {
    ...mapState({
      scroll: state => state.lyrics.scroll,
    }),
  },
  watch: {
    scroll (newVal, oldVal) {
      if (newVal !== oldVal) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.delayedScrollStatus = newVal
        }, 150)
      }
    },
  },
  beforeCreate () {
    this.delayedScrollStatus = this.scroll
  },
}
