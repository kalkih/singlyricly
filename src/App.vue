<template>
  <div id="app" :style="themeStyle">
    <transition name="fade-bg--img">
      <div v-if="thumbnail"
        class="app__bg app__bg--image"
        :style="bgImageStyle"
        :key="alt">
      </div>
    </transition>
    <transition name="fade-bg" mode="in-out">
      <div
        class="app__bg"
        :style="bgStyle"
        :key="alt">
      </div>
    </transition>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import * as Vibrant from 'node-vibrant'
import { mapState, mapActions } from 'vuex'

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
      themeHead: state => state.theme.head,
      themeColor: state => state.theme.normal,
      themeColorDark: state => state.theme.dark,
      themeColorLight: state => state.theme.light,
    }),
    themeStyle () {
      return {
        '--theme-color': this.themeColor ? this.themeColor.hsl() : '',
        '--theme-color-dark': this.themeColorDark ? this.themeColorDark.hsl() : '',
        '--theme-color-light': this.themeColorLight ? this.themeColorLight.hsl() : '',
      }
    },
    bgStyle () {
      return this.themeColor ? {
        backgroundImage: `linear-gradient(${this.themeColor.hsla(0.65)}, #0d0d0d 95%)`,
      } : {}
    },
    bgImageStyle () {
      return {
        backgroundImage: `url(${this.thumbnail})`,
      }
    },
  },
  methods: {
    ...mapActions({
      setTheme: 'theme/setAll',
      setMetaTheme: 'theme/setMeta',
    }),
    setMetaTheme (hex) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', hex)
    },
  },
  watch: {
    async thumbnail (newVal, oldVal) {
      this.alt = +!this.alt
      if (newVal && oldVal !== newVal) {
        let p = await Vibrant.from(newVal).getPalette()
        this.setTheme(p.Vibrant.hsl)
      }
    },
    async themeHead (newVal, oldVal) {
      this.alt = +!this.alt
      if (newVal && oldVal !== newVal) {
        this.setMetaTheme(newVal)
      }
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Pacifico');
@import url('https://fonts.googleapis.com/css?family=Montserrat:500,600,700');

@import './styles/_includes';

#app {
  height: 100%;
  animation: fade-in .5s ease;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100px;
    pointer-events: none;
  }

  main {
    height: 100%;
  }
}

.app__bg {
  position: fixed;
  z-index: -2;
  height: 100%;
  width: 100%;
  opacity: 1;
  background-image: linear-gradient(var(--theme-color-alpha), #0d0d0d 85%);

  &--image {
    opacity: .25;
    z-index: -3;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-image: none;
  }
}
</style>
