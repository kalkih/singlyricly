module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
  ],
  rules: {
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
