import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      device: state => state.playback.device,
    }),
    baseDelay () {
      switch (this.device) {
        case 'CastAudio':
          return -250
        // case 'Computer':
        //   return -1500
        // case 'Smartphone':
        //   return -1500
        default:
          return -1500
      }
    },
  },
}
