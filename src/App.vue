<template>
  <div id="app" :style="themeStyle">
    <transition name="fade-bg">
      <div v-if="thumbnail"
        class="app__bg app__bg--image"
        :style="bgImageStyle"
        :key="alt">
      </div>
    </transition>
    <transition name="fade-bg">
      <div
        class="app__bg"
        :style="bgStyle"
        :key="themeColor">
      </div>
    </transition>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import * as Vibrant from 'node-vibrant'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      alt: 1,
      themeColor: 'var(--default-color)',
      themeColorLight: '',
    }
  },
  computed: {
    ...mapState({
      thumbnail: state => state.playback.track.thumbnail,
    }),
    themeStyle () {
      return {
        '--theme-color': this.themeColorLight,
      }
    },
    bgStyle () {
      return {
        background: this.themeColor,
      }
    },
    bgImageStyle () {
      return {
        backgroundImage: `url(${this.thumbnail})`,
      }
    },
  },
  methods: {
    setThemeMeta (color) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
    }
  },
  watch: {
    async thumbnail (newVal, oldVal) {
      this.alt = +!this.alt
      if (newVal && oldVal !== newVal) {
        let palette = await Vibrant.from(newVal).getPalette()
        this.themeColor = palette.Vibrant.hex
        this.themeColorLight = palette.Vibrant.hex
        this.setThemeMeta(palette.DarkVibrant.hex)
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
  background: var(--bg-color);
  height: 100%;
  touch-action: none;
  overflow: hidden;
  overscroll-behavior-y: none;
}
body {
  height: 100%;
  overflow: hidden;
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
  -webkit-overflow-scrolling: touch;

  @media only screen and (max-height: 640px) {
    font-size: 12px;
  }
}
svg {
  fill: var(--font-color);
}
.svg-sad {
  fill: var(--font-color);;
  stroke: var(--font-color);;
}

a {
  color: #fff;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.spinner {
  @extend %spinner;
}

#app {
  height: 100%;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100px;
    background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, transparent 100%);
    pointer-events: none;
  }

  main {
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,.25) 100%) !important;
  }
}

.app__bg {
  position: fixed;
  z-index: -2;
  opacity: .85;
  height: 100%;
  width: 100%;

  // $blur: 5px;
  // height: calc(100% + $blur * 2);
  // width: calc(100% + $blur * 2);
  // top: $blur;
  // left: $blur;

  &--image {
    opacity: 1;
    z-index: -3;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    // filter: gray;
    // filter: grayscale(100%);
    // filter: blur($blur);
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
.fade-bg-enter,
.fade-bg-leave-to {
  opacity: 0 !important;
}
// .fade-bg-enter-to, .fade-bg-leave {
//   opacity: .85;
// }
</style>
