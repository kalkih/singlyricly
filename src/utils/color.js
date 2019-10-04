const getHsl = (arr, per = 0) => {
  const l = Math.max(15, Math.min((arr[2] * 100 - per), 100))
  return `hsl(${arr[0] * 360}, ${arr[1] * 100}%, ${l}%)`
}

export default getHsl
