const LongTouch = {
  install (Vue) {
    function handleTouchStart (ev) {
      let $this = this.$$longtouch
      $this.cancelled = false
      $this.touchStart = ev.timeStamp
    }
    function handleTouchEnd (ev) {
      let $this = this.$$longtouch
      if (!$this.cancelled && ev.timeStamp - $this.touchStart > $this.length) {
        const { binding } = $this
        if (typeof binding.value === 'function') {
          binding.value(ev)
        }
      }
    }
    function reset (ev) {
      this.$$longtouch.cancelled = true
    }
    Vue.directive('longtouch', {
      bind (el, binding) {
        el.$$longtouch = {
          binding,
          length: Number(binding.arg) || 350,
        }
        el.addEventListener('touchstart', handleTouchStart)
        el.addEventListener('touchend', handleTouchEnd)
        el.addEventListener('touchmove', reset, { passive: true })
        el.addEventListener('touchcancel', reset)
      },
      unbind (el) {
        el.removeEventListener('touchstart', handleTouchStart)
        el.removeEventListener('touchend', handleTouchEnd)
        el.removeEventListener('touchmove', reset)
        el.removeEventListener('touchcancel', reset)
      },
    })
  },
}

export default LongTouch
