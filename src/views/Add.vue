<template>
  <div class="the-add">
    <the-header/>
    <div class="the-add__lyrics">
      <div
        class="the-add__lyrics__input"
        contenteditable="true"
        ref="input"
        @focus="focus"
        @blur="blur">
        Lyrics...
      </div>
    </div>
    <div class="the-add__buttons">
      <base-button circle @click.native="exit">
        <close/>
      </base-button>
      <base-button @click.native="save">Save</base-button>
      <base-button circle @click.native="reset">
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
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    TheHeader,
    BaseButton,
    close,
    reload,
  },
  data () {
    return {
      initial: true,
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
    }),
    ...mapGetters({
      hasLyrics: 'lyrics/hasLyrics',
    }),
    length () {
      return this.lyrics.length
    },
  },
  methods: {
    ...mapActions({
      saveLyrics: 'lyrics/save',
    }),
    focus () {
      if (this.initial) {
        this.initial = false
        this.$refs.input.innerHTML = ''
      }
    },
    blur () {
      if (this.$refs.input.innerHTML === '') {
        this.reset()
      }
    },
    exit () {
      this.$router.push('/')
    },
    save () {
      this.saveLyrics()
    },
    reset () {
      this.$refs.input.innerHTML = 'Lyrics...'
      this.initial = true
    },
  },
  created () {
    if (!this.track.id || this.hasLyrics) {
      this.$router.push('/')
    }
    this.$nextTick(() => this.$refs.input.focus())
  },
}
</script>

<style lang="scss" scoped>
.the-add {
  height: 100%;

  &__lyrics {
    font-size: 2em;
    font-weight: 600;
    padding: 80px 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-align: center;

    @media only screen and (min-width: 640px) {
      font-size: calc(2em + 1vw);
    }

    &__input {
      mask-image: linear-gradient(transparent, black 10%, black 90%, transparent 100%);
      z-index: 1;
      word-break: break-all;
      padding: 1em;
      width: 100%;
      overflow: scroll;
      max-height: 100%;
      line-height: 1.5em;
      opacity: .75;

      &:focus {
        opacity: 1;
      }
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

    .next {
      text-align: center;
      height: auto;
      min-height: 2.6em;
      padding: .4em 1em;
      margin: 0 10px;
      font-weight: 600;
    }
  }
  .line-trans-leave-active,
  .line-trans-enter-active {
    transition:
      opacity .1s ease-out,
      transform .1s ease-out;
  }
  .line-trans-enter {
    opacity: 0 !important;
    transform:
      translateY(1em)
      scale3d(.75,.75,.75);
  }
  .line-trans-leave-to {
    opacity: 0 !important;
    transform:
      translateY(-1em)
      scale3d(.75,.75,.75);
  }
}
</style>
