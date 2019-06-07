<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      togglePlayback: 'playback/toggle',
      addDelay: 'settings/addDelay',
      subtractDelay: 'settings/subtractDelay',
    }),
    action (ev) {
      const { keyCode } = event
      if (keyCode === 32) {
        this.togglePlayback()
        ev.preventDefault()
      } else if (keyCode === 187) {
        this.addDelay()
      } else if (keyCode === 189) {
        this.subtractDelay()
      }
    },
  },
  created () {
    window.addEventListener('keydown', this.action)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.action)
  },
  render: () => null,
}
</script>
