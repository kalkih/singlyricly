let wakeLock = null

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    // console.log('Reaccquired wakelock')
    requestWakeLock()
  }
}

const clearWakeLock = () => {
  wakeLock.removeEventListener('release', clearWakeLock)
}

export const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', clearWakeLock)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    // console.log('Accquired wakelock')
    return wakeLock
  } catch (err) {
    console.log(err)
  }
}

export const releaseWakeLock = async () => {
  try {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    await wakeLock.release()
    // console.log('Released wakelock')
    wakeLock = null
  } catch (err) {
    console.log(err)
  }
}

export const isWakeLockSupported = () => 'wakeLock' in navigator
