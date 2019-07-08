<template>
  <div v-if="updateExists" class="update-toast" @click="refreshApp">
    <base-button>
      <span>New version available, click to refresh</span>
    </base-button>
  </div>
</template>

<script>
import BaseButton from './BaseButton'

export default {
  components: {
    BaseButton,
  },
  data () {
    return {
      refreshing: false,
      registration: null,
      updateExists: false,
    }
  },
  methods: {
    showRefreshUI (e) {
      this.registration = e.detail
      this.updateExists = true
    },
    refreshApp () {
      this.updateExists = false
      if (!this.registration || !this.registration.waiting) return
      this.registration.waiting.postMessage('skipWaiting')
    },
    close () {
      this.updateExists = false
    },
  },
  created () {
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return

      this.refreshing = true
      window.location.reload()
    })
  },
}
</script>

<style lang="scss" scoped>
.update-toast {
  width: 100%;
  height: auto;
  background: linear-gradient(0deg, $accent-color 0%, transparent 100%);
  padding: 30px;
  padding-top: 60px;
  display: flex;
  justify-content: center;
  z-index: 99;
  animation: fade .25s ease-out;

  .base-button {
    font-size: .8em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .1em;
    display: inline-block;;
    height: auto;
    border-radius: 360px;
    opacity: 0;
    animation: fade-in .25s ease-out .25s forwards;

    &:before {
      opacity: 1;
    }
    &:hover {
      &:before {
        opacity: .75;
      }
    }

    > span {
      display: block;
      padding: 1.4em 1.4em;
      text-align: center;
      line-height: 1.8em;
    }
  }

}
</style>
