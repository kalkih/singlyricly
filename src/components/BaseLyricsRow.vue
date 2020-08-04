<template>
  <p
    class="base-lyrics-row"
    :line="index"
    :class="classList">
    {{ text }}
  </p>
</template>

<script>
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
  },
}
</script>
