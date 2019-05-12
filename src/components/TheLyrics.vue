<template>
  <div class="the-lyrics">
    <transition v-if="hasSynced" appear v-on:appear="lyricsCreated" name="lyrics-trans">
      <div class="the-lyrics__lyrics" ref="lyrics">
        <p
          v-for="(entry, index) in synced"
          :key="index"
          :line="index"
          :class="{ active: activeLine === index}">
          {{ entry.line }}
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
import { setTimeout } from 'timers'

export default {
  name: 'TheLyrics',
  components: { sad },
  data () {
    return {
      scroller: null,
      activeLine: 0,
      row: null,
      timer: null,
      offset: 0,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      found: state => state.lyrics.found,
      progress: state => state.playback.progress,
      playing: state => state.playback.playing,
      updatedAt: state => state.playback.updatedAt,
      duration: state => state.playback.track.length,
    }),
    length () {
      return this.synced.length - 1
    },
    hasLyrics () {
      return this.synced || this.normal
    },
    hasSynced () {
      return this.synced
    },
    times () {
      return this.synced.map(line => Number(line.milliseconds))
    },
    serverProgress () {
      return this.progress + (Date.now() - this.updatedAt) - 750
    },
  },
  watch: {
    synced () {
      if (this.scroller && this.hasSynced) {
        console.log('new lyrics, syncing...')
        this.$nextTick(() => this.sync())
      }
    },
    progress () {
      if (this.hasSynced) {
        this.sync()
      }
    },
  },
  methods: {
    computeProgress () {
      return this.progress + (Date.now() - this.updatedAt) - 750
    },
    next () {
      this.activeLine = this.activeLine + 1
      this.move()
    },
    move (line) {
      const prev = this.row
      this.row = this.$refs.lyrics.querySelector(`p[line="${line || this.activeLine}"]`)
      const offset = !prev ? -((this.row.offsetHeight * 1.25)) : 0
      this.scroller.center(this.row, 250, offset + this.offset / 2)
    },
    calculateNext (ms) {
      const timer = ms || (this.times[this.activeLine + 1] - this.computeProgress())
      this.timer = setTimeout(this.tick, timer)
    },
    tick () {
      if (this.hasSynced && this.activeLine < this.length) {
        this.next()
        this.calculateNext()
      }
    },
    pause () {
      this.clear()
    },
    clear () {
      if (this.timer) {
        clearTimeout(this.timer._id)
        this.timer = null
      }
    },
    resume () {
      this.sync()
    },
    sync () {
      const progress = this.serverProgress
      this.clear()

      const line = this.times.findIndex(time => time > progress)
      this.activeLine = line === -1
        ? this.length
        : line === 0 ? line : line - 1

      if (line < this.length) {
        // if (line !== this.activeLine) {
        //   this.move()
        // }
        this.move()
        if (this.playing) {
          this.calculateNext()
        }
      }
    },
    lyricsCreated (el, done) {
      this.scroller = this.$scroll.createScroller(el, 1000)
      this.offset = this.$refs.lyrics.offsetTop
      this.sync()
      done()
    },
  },
  destroyed () {
    this.clear()
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
    position: relative;

    &:before {
      content: '';
      padding-top: calc(50vh - 3em);
    }
    &:after {
      content: '';
      padding-top: calc(50vh - 3em);
    }

    p {
      transition: transform .15s cubic-bezier(0.645, 0.045, 0.355, 1);;
      max-width: 75%;
      word-break: break-word;
      opacity: .75;

      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        transform: scale(1.25);
        opacity: 1;
      }

      @media only screen and (min-width: 640px) {
        max-width: 60%;
        font-size: calc(1em + 1vw);

        &.active {
          transform: scale(1.4);
        }
      }
    }
  }
  .lyrics-trans-leave-active {
    display: none;
  }
}
</style>
