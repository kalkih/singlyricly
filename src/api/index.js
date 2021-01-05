import auth from './auth'
import spotify from './spotify'
import lyrics from './lyrics'

const defaultOpts = {
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

export default {
  auth,
  spotify,
  lyrics,
  defaultOpts,
}
