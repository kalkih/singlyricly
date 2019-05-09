<template>
  <div class="the-lyrics">

    <p v-if="hasLyrics" class="the-lyrics__lyrics">{{ normal }}</p>
    <div v-else class="the-lyrics__loading">
      <h2>We're getting your lyrics, stay tuned!</h2>
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'TheLyrics',
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
    }),
    hasLyrics () {
      return this.synced || this.normal
    },
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics {
  font-weight: 600;
  width: 100%;
  padding: 20px;
  font-size: 2em;
  text-align: center;
  letter-spacing: .015em;
  display: flex;
  align-items: center;
  flex-flow: row;
  height: 100vh;

  .the-lyrics__loading {
    margin: 0 auto;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 10%;

    h2 {
      font-size: 1em;
      margin-bottom: 3em;
      color: $accent-color;
      opacity: .75;
    }

    .spinner {
      font-size: .8em;
    }
  }

  &__lyrics {
    background: linear-gradient(
      180deg,
      transparent 10%,
      #fff 40%,
      #fff 60%,
      transparent 90%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    line-height: 3em;
    max-height: 100vh;
    height: auto;
    animation: fade-in .5s ease-out;
  }
}
</style>
