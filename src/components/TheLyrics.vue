<template>
  <div class="the-lyrics">
    <transition v-if="hasLyrics" appear v-on:appear="lyricsCreated">
      <div class="the-lyrics__lyrics" ref="lyrics">
        <p
          v-for="(entry, index) in synced"
          :key="index"
          :line="index"
          :class="{ active: activeLine === index}">
          <template v-if="entry.line">
            {{ entry.line }}
          </template>
          <template v-else>
            - - -
          </template>
        </p>
      </div>
    </transition>
    <div v-else class="the-lyrics__loading">
      <div v-if="found">
        <h2>We're getting your lyrics, stay tuned!</h2>
        <div class="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="not-found" v-else>
        <sad/>
        <h2>Sorry but couldn't find any lyrics for this track</h2>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import sad from '@/assets/sad.svg'

export default {
  name: 'TheLyrics',
  components: { sad },
  data () {
    return {
      scroller: {},
      activeLine: 0,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      found: state => state.lyrics.found,
    }),
    hasLyrics () {
      return this.synced || this.normal
    },
  },
  watch: {
    synced () {
    },
  },
  methods: {
    nextLine () {
      this.activeLine = this.activeLine + 1
      const row = this.$refs.lyrics.querySelector(`p[line="${this.activeLine}"]`)
      this.scroller.center(row, 100, -(row.offsetHeight / 2))
    },
    lyricsCreated (el, done) {
      this.scroller = this.$scroll.createScroller(el, 1000, 0)
      this.nextLine()
      for (let index = 1; index < this.synced.length; index++) {
        setTimeout(() => {
          this.nextLine()
        }, 3000 * index)
      }
      done()
    },
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics {
  font-weight: 600;
  width: 100%;
  font-size: 1.8em;
  text-align: center;
  letter-spacing: .015em;
  display: flex;
  align-items: center;
  flex-flow: row;
  height: 100vh;

  .the-lyrics__loading {
    width: 100%;

    > div {
      margin: 0 auto;
      display: flex;
      flex-flow: column;
      align-items: center;
      margin-bottom: 10%;
      animation: fade-in .5s ease-out;
    }

    svg {
      height: 4em;
      fill: $accent-color;
      margin-bottom: 1em;
    }

    h2 {
      font-size: 1em;
      color: $accent-color;
      opacity: .75;
      margin: 0;
    }

    .spinner {
      font-size: .8em;
      margin-top: 3em;
    }
  }

  &__lyrics {
    mask-image: linear-gradient(transparent 0%, black 30%, black 70%, transparent 100%);
    -webkit-mask-image: linear-gradient(transparent 0%, black 30%, black 70%, transparent 100%);

    max-height: calc(100vh - 6em);
    animation: fade-in .5s ease-out;
    overflow-y: scroll;
    overflow-x: visible;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    scroll-behavior: smooth;

    p {
      transition: transform .25s;
      max-width: 75%;
      word-break: break-word;

      &:first-child {
        position: relative;
        padding-top: calc(50vh - 6em);
      }
      &:last-child {
        margin-bottom: calc(50vh - 6em);
      }

      &.active {
        transform: scale(1.25);
      }
    }
  }
}
</style>
