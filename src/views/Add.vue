<template>
  <div class="the-add">
    <the-header/>
    <transition name="swap-trans" mode="out-in">
      <div v-if="step === 1" class="the-add__lyrics" key="lyrics">
        <div>
          <textarea
            class="the-add__lyrics__input"
            ref="input"
            :placeholder="placeholder"
            spellcheck="false">
          </textarea>
        </div>
      </div>
      <div v-else class="the-add__info" key="info">
        <transition name="swap-trans" mode="out-in">
          <div v-if="step === 2" key="two">
            <h2>Processing lyrics...</h2>
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div v-else-if="step === 3" key="three">
            <h2>That's it, well done!</h2>
            <base-button accent @click.native="exit">Return to app</base-button>
          </div>
          <div v-else key="res">
            <sad/>
            <h2>Oops! Something went wrong, please try again</h2>
            <base-button @click.native="exit">Reload</base-button>
          </div>
        </transition>
      </div>
    </transition>
    <div class="the-add__buttons">
      <base-button circle transparent @click.native="exit">
        <close/>
      </base-button>
      <base-button v-if="step === 1" class="save" @click.native="save">Submit</base-button>
      <base-button v-if="step !== 9" circle transparent @click.native="reset">
        <reload/>
      </base-button>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import BaseButton from '@/components/BaseButton'
import close from '@/assets/close.svg'
import reload from '@/assets/reload.svg'
import sad from '@/assets/sad.svg'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
    close,
    reload,
    sad,
  },
  data () {
    return {
      initial: true,
      step: 1,
      cachedTrack: null,
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
      normal: state => state.lyrics.normal,
    }),
    artist () {
      return this.cachedTrack.artist
    },
    title () {
      return this.cachedTrack.title
    },
    placeholder () {
      return `Add lyrics... \n ${this.title} - ${this.artist}`
    },
  },
  methods: {
    ...mapActions({
      saveLyrics: 'lyrics/saveLyrics',
      clearPlayback: 'playback/clear',
      clearLyrics: 'lyrics/clearLyrics',
    }),
    isEmpty () {
      return !(this.$refs.input.value) ||
        this.$refs.input.value === ''
    },
    exit () {
      this.clearPlayback()
      this.clearLyrics()
      this.$router.push('/')
    },
    async save () {
      if (this.isEmpty() || this.step !== 1) return
      this.step = 2
      const saved = await this.saveLyrics({
        lyrics: this.$refs.input.value,
        track: this.cachedTrack,
      })
      if (saved) {
        this.step = 3
      } else {
        this.step = 9
      }
    },
    reset () {
      this.$refs.input.value = ''
      this.step = 1
      this.$refs.input.focus()
    },
  },
  created () {
    if (!this.track.id) {
      this.$router.push('/')
    } else {
      this.cachedTrack = this.track
      this.$nextTick(() => {
        if (this.normal) {
          this.$refs.input.value = this.normal.join('\n')
        }
        this.$refs.input.focus()
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.the-add {
  height: 100%;

  &__lyrics {
    padding: 60px 0 6em 0;
    width: 100%;
    height: 100%;
    animation: fade-in .5s ease-out;

    > div {
      height: calc(100% - 1em);
      width: 100%;
      background: transparent;
      mask-image: linear-gradient(transparent, black 4em, black calc(100% - .25em), transparent 100%);
    }

    &__input {
      font-size: 1.4em;
      font-weight: 600;
      color: var(--font-color);
      background: transparent;
      text-align: center;
      display: block;
      z-index: 1;
      // word-break: break-all;
      width: 100%;
      height: 100%;
      overflow: scroll;
      max-height: 100%;
      line-height: 1.5em;
      opacity: .9;
      resize: none;
      outline: none;
      border: 0;
      padding: 25% 1em 1em 1em;
      line-height: 2em;
      overflow: auto;
      letter-spacing: .05em;
      font-family:
        'Montserrat',
        'Helvetica Neue',
        Helvetica,
        Arial,
        sans-serif;

      @media only screen and (min-width: 640px) {
        font-size: calc(1.2em + 1vw);
      }

      @media only screen and (max-height: 640px) {
        font-size: 1.6em;
      }

      &:focus {
        opacity: 1;
      }

      &::placeholder {
        opacity: .5;
        color: var(--font-color);
      }
    }
  }

  &__info {
    width: 100%;
    height: 100%;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.4em;
    animation: fade-in .5s ease-out;

    @media only screen and (min-width: 640px) {
      font-size: calc(1em + 1vw);
    }

    > div {
      display: flex;
      flex-flow: column;
      align-items: center;
    }

    p {
      color: var(--font-color);
      font-size: .8em;
      margin: 0 0 1em 0;
      line-height: 1.5em;
    }

    h2, h3 {
      margin-top: 0;
    }

    svg {
      height: 5em;
      margin-bottom: 1em;
    }

    .base-button {
      font-size: .7em;
      margin-top: 1em;
    }
    .spinner {
      font-size: 1.2em;
      margin-top: 1em;
    }
  }

  &__buttons {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fade-in .5s ease-out;

    .save {
      font-size: 1em;
      padding: 1.2em 2.6em;
      margin: 0 10px;
    }
  }
}
</style>
