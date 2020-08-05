<template>
  <div v-if="isSupported" class="wake-lock-toggle">
    <base-toggle :state="keepAwakeState" label="KEEP 💡 ON" @toggle="setKeepAwake"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { isWakeLockSupported } from '../utils/wake'
import BaseToggle from './BaseToggle'

export default {
  name: 'WakeLockToggle',
  components: {
    BaseToggle,
  },
  data () {
    return {
      isSupported: false,
    }
  },
  computed: {
    ...mapState({
      keepAwakeState: state => state.settings.keepAwake,
    }),
  },
  methods: {
    ...mapActions({
      setKeepAwake: 'settings/setKeepAwake',
    }),
  },
  created () {
    this.isSupported = isWakeLockSupported()
  },
}
</script>

<style lang="scss" scoped>
.wake-lock-toggle {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  margin-top: .6em;
}
</style>
