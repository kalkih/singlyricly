export default {
  update (el, binding) {
    el.$$scroll.enabled = binding.value.enabled
    el.$$scroll.pos = binding.value.pos
  },
  bind (el, binding) {
    el.$$scroll = {
      THRESHOLD: 150,
      ...binding.value,
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    el.addEventListener('touchend', handleTouchend)
  },
  unbind (el) {
    el.removeEventListener('scroll', handleScroll)
    el.removeEventListener('touchend', handleTouchend)
  },
}

function handleScroll (ev) {
  const $this = this.$$scroll
  if ($this.enabled) {
    clearTimeout($this.scrollTimer)
    $this.isScrolling = true
    $this.scrollTimer = setTimeout(() => {
      $this.isScrolling = false
    }, 66)
    const scrollOffset = Math.abs(ev.target.scrollTop - $this.pos)
    $this.offset(Math.min(Math.max(scrollOffset / 15, 0), 10))
    if (scrollOffset > $this.THRESHOLD) {
      $this.offset(0)
      $this.override(ev)
    }
  }
}
function handleTouchend (ev) {
  const $this = this.$$scroll
  clearInterval($this.touchEndTimer)
  if ($this.isScrolling) {
    $this.touchEndTimer = setInterval(() => {
      if (!$this.isScrolling) {
        $this.offset(0)
        $this.center(ev)
        clearInterval($this.touchEndTimer)
      }
    }, 50)
  } else {
    $this.offset(0)
    $this.center(ev)
  }
}
