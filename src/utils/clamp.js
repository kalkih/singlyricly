export default (val, min, max) => {
  return Math.min(Math.max(val, min), max)
}
