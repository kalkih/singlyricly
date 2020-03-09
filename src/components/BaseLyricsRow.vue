<template>
  <p
    class="base-lyrics-row"
    :line="index"
    :class="classList"
    :seek="supportsSeek"
    @click.prevent="handleClick">
    {{ text }}
  </p>
</template>

<script>
import { mapActions } from 'vuex'
const TEXT_EMPTY = '● ● ●'

export default {
  props: {
    text: {
      type: String,
      default: TEXT_EMPTY,
    },
    index: {
      type: Number,
    },
    position: {
      type: Number,
      default: -1,
    },
    active: {
      type: Boolean,
    },
  },
  computed: {
    classList () {
      return {
        'active-line': this.active,
      }
    },
    supportsSeek () {
      return this.position >= 0
    },
  },
  methods: {
    ...mapActions({
      seek: 'playback/seek',
      setAutoSync: 'lyrics/setScroll',
    }),
    handleClick () {
      if (this.supportsSeek) {
        this.seek(Number(this.position))
        this.setAutoSync(true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.base-lyrics-row {
  &[seek] {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
