export default {
  nestedNav: state => state.about || state.privacyPolicy,
  errored: state => state.error.code || state.error.message,
}
