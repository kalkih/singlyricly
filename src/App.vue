<template>
  <div id="app">
    <transition name="fade-bg">
      <div v-if="thumbnail"
        class="app__bg"
        :style="styleObject"
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

export default {
  name: 'App',
  components: {},
  data () {
    return {
      alt: 1,
    }
  },
  computed: {
    ...mapState({
      thumbnail: state => state.playback.track.thumbnail,
    }),
    styleObject () {
      return {
        backgroundImage: `url(${this.thumbnail})`,
      }
    },
  },
  watch: {
    thumbnail () {
      this.alt = +!this.alt
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
  background-color: $accent-color !important;
  background-image: linear-gradient(135deg, $accent-color 0%, $secondary-color 100%) !important;
  // background-image: linear-gradient(135deg, $accent-color 0%, lighten(adjust-color($accent-color, -100), 70%)) !important;
  height: 100%;
  touch-action: none;
  overflow: hidden;
  overscroll-behavior-y: none;
  // animation: bg 15s ease infinite;
  // background-size: 400% 400%;
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
  fill: $accent-color;
}
.svg-sad {
  fill: $accent-color;
  stroke: $accent-color;
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

  main {
    height: 100%;
  }
}

.app__bg {
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  opacity: .1;
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
}
.fade-bg-leave-to {
  opacity: 0 !important;
}
.fade-bg-enter-to, .fade-bg-leave {
  opacity: .1;
}
</style>
