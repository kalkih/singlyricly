<template>
  <div class="base-button">
    <span v-if="text">{{ text }}</span>
    <span v-if="icon">{{ icon }}</span>
    <span><slot></slot></span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.base-button {
  position: relative;
  cursor: pointer;
  display: block;
  font-size: 1.4em;
  border-radius: 2em;
  padding: .4em 1em;
  user-select: none;
  overflow: hidden;
  font-weight: 400;
  -webkit-tap-highlight-color: transparent;

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: #085078;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: opacity .1s;
  }

  &:hover {
    &:before {
      opacity: .75;
    }
  }
}
</style>
