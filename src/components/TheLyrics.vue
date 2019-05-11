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
import { setTimeout } from 'timers'

export default {
  name: 'TheLyrics',
  components: { sad },
  props: [ 'updatePlayback' ],
  data () {
    return {
      scroller: null,
      activeLine: 0,
      timeout: null,
    }
  },
  computed: {
    ...mapState({
      synced: state => state.lyrics.synced,
      normal: state => state.lyrics.normal,
      found: state => state.lyrics.found,
      progress: state => state.playback.progress,
      updatedAt: state => state.playback.updatedAt,
      duration: state => state.playback.track.length,
    }),
    length () {
      return this.synced.length - 1
    },
    hasLyrics () {
      return this.synced || this.normal
    },
    times () {
      return this.synced.map(line => Number(line.milliseconds))
    },
    serverProgress () {
      const now = Date.now()
      return this.progress + (now - this.updatedAt)
    },
  },
  watch: {
    synced () {
      if (this.scroller) {
        console.log('new lyrics, syncing...')
        this.$nextTick(() => this.sync())
      }
    },
  },
  methods: {
    next () {
      this.activeLine = this.activeLine + 1
      this.move()
    },
    move (line) {
      const row = this.$refs.lyrics.querySelector(`p[line="${line || this.activeLine}"]`)
      this.scroller.center(row, 250, -(row.offsetHeight / 2))
    },
    sync () {
      const progress = this.serverProgress

      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      const line = this.times.findIndex(time => time > progress) || 0
      this.activeLine = line > 0 ? line - 1 : 0

      const next = this.times[this.activeLine + 1] - progress
      this.move(line)
      this.calculateNext(next)
    },
    lyricsCreated (el, done) {
      this.scroller = this.$scroll.createScroller(el, 1000, 0)
      this.sync()
      done()
    },
    calculateNext (ms) {
      if (this.activeLine >= this.length) {
        setTimeout(this.updatePlayback, this.duration - this.times[this.activeLine] + 1000)
        this.pause()
        return
      }
      const timer = ms || (this.times[this.activeLine + 1] - this.times[this.activeLine])
      this.timeout = setTimeout(() => {
        this.next()
        this.calculateNext()
      }, timer)
    },
    pause () {
      clearTimeout(this.timeout)
      this.timeout = null
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
