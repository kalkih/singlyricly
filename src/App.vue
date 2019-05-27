<template>
  <div id="app" :style="appStyle">
    <div class="debug" :style="{ background: this.color[this.alt][0] }"></div>
    <div class="debug--1" :style="{ background: this.color[this.alt][1] }"></div>
    <transition name="fade-color">
      <div :key="alt" class="app__bg" :style="bgStyle"></div>
    </transition>
    <transition name="fade-bg">
      <div v-if="thumbnail"
        class="app__bg app__bg--image"
        :style="imageStyle"
        :key="alt">
      </div>
    </transition>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as Vibrant from 'node-vibrant'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      alt: 1,
      color: [
        '',
        '',
      ],
    }
  },
  computed: {
    ...mapState({
      thumbnail: state => state.playback.track.thumbnail,
    }),
    bgStyle () {
      return {
        background: `linear-gradient(135deg, ${this.color[0]} 0%, ${this.color[1]} 100%)`,
      }
    },
    appStyle () {
      return {
        '--accent-color': this.color[0],
        '--accent-color-trans': this.color[0],
        '--accent-color-light': this.color[1],
      }
    },
    imageStyle () {
      return {
        backgroundImage: `url(${this.thumbnail})`,
      }
    },
  },
  watch: {
    async thumbnail (newVal, oldVal) {
      this.alt = +!this.alt
      if (newVal && oldVal !== newVal) {
        let v = new Vibrant(newVal)
        const { DarkVibrant, LightVibrant } = await v.getPalette()
        this.color = [DarkVibrant.hex, LightVibrant.hex]
      }
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');
@import url('https://fonts.googleapis.com/css?family=Montserrat:500,600,700');
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  user-select: none;
}
html {
  background: linear-gradient(135deg, $accent-color 0%, $secondary-color 100%) !important;
  background: black;
  height: 100%;
  overflow: hidden;
  // animation: bg 15s ease infinite;
  // background-size: 400% 400%;

  --accent-color: #085078;
  --accent-color-trans: #085078;
  --accent-color-light: #85D8CE;
}
body {
  height: 100%;
  padding: 0;
  margin: 0;
  color: #fff;
  font-family:
    'Montserrat',
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif;
  touch-action: none;
}
svg {
  fill: var(--accent-color-trans);
}
.svg-sad {
  fill: var(--accent-color-trans);
  stroke: var(--accent-color-trans);
}
a {
  color: #fff;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.spinner {
  @extend %spinner;
}

.app__bg {
  position: fixed;
  height: 100%;
  width: 100%;

  &--image {
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    opacity: .1;
    mask-image: linear-gradient(transparent 0%, black 200px, black calc(100% - 200px), transparent 100%);
    -webkit-mask-image: linear-gradient(transparent 0%, black 200px, black calc(100% - 200px), transparent 100%);
  }
}

@keyframes bg {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

.fade-bg-leave-active,
.fade-bg-enter-active {
  transition: opacity 2.5s $easeInOutCubic;
}
.fade-bg-enter {
  opacity: 0 !important;
  opacity: 0 !important;
}
.fade-bg-enter-to, .fade-bg-leave {
  opacity: .1;
}

.fade-color-leave-active,
.fade-color-enter-active {
  transition: opacity 1.5s $easeInOutCubic;
}
.fade-color-enter {
  opacity: 0 !important;
}
.fade-color-enter-to, .fade-color-leave {
  opacity: 1 !important;
}
</style>
