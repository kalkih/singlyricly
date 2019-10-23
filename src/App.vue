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
      themeColor: state => state.theme.normal,
      themeColorDark: state => state.theme.dark,
    }),
    themeStyle () {
      return {
        '--theme-color': this.themeColor,
        '--theme-color-dark': this.themeColorDark,
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
        this.setMetaTheme(p.Vibrant.hex)
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
    background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, transparent 100%);
    pointer-events: none;
  }

  main {
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,.25) 100%);
  }
}

.app__bg {
  position: fixed;
  z-index: -2;
  opacity: .85;
  height: 100%;
  width: 100%;

  &--image {
    opacity: 1;
    z-index: -3;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }
}
</style>
