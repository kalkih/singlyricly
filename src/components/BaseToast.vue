<template>
  <div class="base-toast">
    <div>
      <base-button>
        <div>
          <span v-if="message"> {{ message }}</span>
          <slot></slot>
          <close/>
        </div>
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton'
import close from '@/assets/close.svg'

export default {
  components: {
    BaseButton,
    close,
  },
  props: {
    message: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.base-toast {
  width: 100%;
  height: auto;
  background: linear-gradient(180deg, $accent-color 0%, transparent 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  z-index: 2000;
  animation: fade .25s ease-out;
  top: 0;
  position: fixed;

  > div {
    animation: fade-in-top .25s ease-out .15s forwards;
    opacity: 0;
  }

  .base-button {
    max-width: 640px;
    font-size: .7em;
    letter-spacing: .075em;
    width: calc(100vw - 40px);
    border-radius: 360px;
    color: $accent-color;
    box-shadow: 0px 0px 2em rgba(0,0,0,.5);

    @media only screen and (min-width: 640px) {
      font-size: .8em;
    }

    &:before {
      opacity: 1;
      background: #fff;
    }
    &:hover {
      &:before {
        opacity: .85;
      }
    }

    > div {
      display: flex;
      text-align: center;
      line-height: 1.6em;
      align-items: center;
      justify-content: center;
      padding: 1.4em 30px;

      svg {
        position: absolute;
        left: 10px;
        fill: $accent-color;
        height: 16px;
      }
    }
  }

}
</style>
