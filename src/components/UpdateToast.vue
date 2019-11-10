<template>
  <div v-if="updateExists" class="update-toast" @click="refreshApp">
    <div>
      <base-button>
        <span>New version available, click to refresh</span>
      </base-button>
    </div>
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
      if (!this.registration || !this.registration.waiting) {
        this.updateExists = false
        return
      }
      this.registration.waiting.postMessage('skipWaiting')
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
  background: linear-gradient(0deg, rgba(0,0,0,.75) 0%, transparent 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  z-index: 10;
  animation: fade .25s ease-out;

  > div {
    animation: fade-in .25s ease-out .25s forwards;
    opacity: 0;
  }

  .base-button {
    font-size: .8em;
    text-transform: uppercase;
    letter-spacing: .075em;
    border-radius: 360px;
    box-shadow: 0px 0px 2em rgba(0,0,0,.5);

    > span {
      display: block;
      padding: 1.4em 1.4em;
      text-align: center;
      line-height: 1.8em;
    }
  }

}
</style>
