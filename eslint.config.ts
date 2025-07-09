import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  vue: {
    a11y: false,
  },
  typescript: true,
  rules: {
    'vue-a11y/media-has-caption': 'off',
    'vue/no-useless-v-bind': ['off', {
      ignoreStringEscape: true,
    }],
  },
})
