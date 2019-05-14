<template>
  <div id="app">
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
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
  background: linear-gradient(135deg, #085078 0%, #85D8CE 100%);
  height: 100%;
  overflow: hidden;
  // animation: bg 15s ease infinite;
  // background-size: 400% 400%;
}
body {
  padding: 0;
  margin: 0;
  color: #fff;
  font-family:
    'Montserrat',
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif;
}
a {
  color: #fff;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.spinner {
  @extend %spinner;
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
</style>
