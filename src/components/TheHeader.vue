<template>
  <div class="the-header">
    <h1 class="the-header__title">{{ title }}</h1>
    <base-button
      v-if="username"
      class="the-header__settings"
      :text="'Hey ' + username">
      <dropdown/>
    </base-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseButton from './BaseButton'
import dropdown from '@/assets/dropdown.svg'

export default {
  components: {
    BaseButton, dropdown,
  },
  computed: {
    title: () => {
      return process.env.VUE_APP_NAME
    },
    ...mapState({
      username: state => state.user.name,
    }),
  },
}
</script>

<style lang="scss" scoped>
.the-header {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: absolute;
  width: 100%;
  z-index: 10;

  @media only screen and (min-width: 640px) {
    justify-content: space-between;
    padding: 20px;

    .the-header__title {
      font-size: 2.4em;
    }

    .the-header__settings {
      display: flex;
    }
  }

  &__settings {
    display: none;
    animation: reveal .25s ease-out;
  }

  &__title {
    font-family: 'Pacifico', cursive;
    font-weight: 500;
    margin: 0;
    font-size: 2em;
    cursor: pointer;
    transition: opacity .1s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      opacity: .75;
    }
  }

}
</style>
