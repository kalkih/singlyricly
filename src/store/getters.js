export default {
  nestedNav: state => state.about || state.privacyPolicy || state.report,
  errored: state => state.error.code || state.error.message,
}
