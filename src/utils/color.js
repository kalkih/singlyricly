const MIN = 10
const MAX = 100
const DEGREES = 360
const MULTI = 100

const getHsl = (arr, per = 0) => {
  const l = Math.max(MIN, Math.min((arr[2] * MULTI - per), MAX))
  return `hsl(${arr[0] * DEGREES}, ${arr[1] * MULTI}%, ${l}%)`
}

export default getHsl
