<template>
  <div class="icon-button">
    <slot></slot>
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
.icon-button {
  font-size: 1.4em;
  position: relative;
  cursor: pointer;
  height: 2.6em;
  width: 2.6em;
  border-radius: 50%;
  overflow: hidden;

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: $accent-color;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: opacity .15s;
  }

  &:hover {
    &:before {
      opacity: .65;
    }

    svg {
      opacity: 1;
    }
  }

  svg {
    transition: opacity .15s;
    opacity: .85;
    fill: #fff;
    width: 1.4em;
    margin: .6em;
  }
}
</style>
