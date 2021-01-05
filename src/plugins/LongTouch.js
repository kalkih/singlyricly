const LongTouch = {
  install (Vue) {
    function handleTouchStart (ev) {
      const $this = this.$$longtouch
      $this.cancelled = false
      $this.timer = setTimeout(() => {
        const { binding } = $this
        if (typeof binding.value === 'function') {
          binding.value(ev)
        }
      }, $this.length)
    }
    function reset (ev) {
      const $this = this.$$longtouch
      if ($this.timer) {
        clearTimeout($this.timer)
        $this.timer = null
      }
    }
    Vue.directive('longtouch', {
      bind (el, binding) {
        el.$$longtouch = {
          binding,
          length: Number(binding.arg) || 500,
        }
        el.addEventListener('touchstart', handleTouchStart)
        el.addEventListener('touchend', reset)
        el.addEventListener('touchmove', reset, { passive: true })
        el.addEventListener('touchcancel', reset)
      },
      unbind (el) {
        el.removeEventListener('touchstart', handleTouchStart)
        el.removeEventListener('touchend', reset)
        el.removeEventListener('touchmove', reset)
        el.removeEventListener('touchcancel', reset)
      },
    })
  },
}

export default LongTouch
