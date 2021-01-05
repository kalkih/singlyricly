import clamp from '@/utils/clamp'
const { round } = Math

const DEGREES = 360
const MULTI = 100

export default class Color {
  constructor (hue = 0, sat = 0, light = 0, opts = {}) {
    if (opts.vibrant) return this._fromVibrant(hue, sat, light)

    this._h = hue
    this._s = sat
    this._l = light
  }

  _fromVibrant (hue, sat, light) {
    this._h = hue * DEGREES
    this._s = sat * MULTI
    this._l = light * MULTI
  }

  set hue (hue) {
    this._h = hue
  }

  set saturation (sat) {
    this._s = sat
  }

  set lightness (light) {
    this._l = light
  }

  saturate (per) {
    const sat = this._s * (per / MULTI + 1)
    this._s = clamp(sat, 0, 100)
    return this
  }

  desaturate (per) {
    return this.saturate(-per)
  }

  lighten (per) {
    const light = this._l * (per / MULTI + 1)
    this._l = clamp(light, 10, 90)
    return this
  }

  darken (per) {
    return this.lighten(-per)
  }

  hsl () {
    const { _h, _s, _l } = this
    return `hsl(${_h}, ${_s}%, ${_l}%)`
  }

  hsla (alpha) {
    const { _h, _s, _l } = this
    return `hsla(${_h}, ${_s}%, ${_l}%, ${alpha})`
  }

  hex () {
    const { _h, _s, _l } = this
    return this._rgb2hex(...this._hsl2rgb(_h, _s, _l))
  }

  _rgb2hex (r, g, b) {
    r = round(r)
    g = round(g)
    b = round(b)
    const u = r << 16 | g << 8 | b
    let str = '000000' + u.toString(16)
    str = str.substr(str.length - 6)
    return `#${str}`
  }

  _hsl2rgb (h, s, l) {
    let r, g, b

    h = h / DEGREES
    s = s / MULTI
    l = l / MULTI

    function hue2rgb (p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [r * 255, g * 255, b * 255]
  }
}
