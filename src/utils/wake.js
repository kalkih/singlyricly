let wakeLock = null

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    console.log('reaqquire wakelock')
    requestWakeLock()
  }
}

const clearWakeLock = () => {
  wakeLock.removeEventListener('release', clearWakeLock)
  console.log('Wakelock released automatically')
}

export const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', clearWakeLock)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    console.log('Wakelock accquired')
    return wakeLock
  } catch (err) {
    console.log(err)
  }
}

export const releaseWakeLock = async () => {
  try {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    await wakeLock.release()
    console.log('Wakelock released')
    wakeLock = null
  } catch (err) {
    console.log(err)
  }
}

export const isWakeLockSupported = () => 'wakeLock' in navigator
