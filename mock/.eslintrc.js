module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  env: {
    es6: true,
    node: true
  },
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'node/no-unpublished-require': 'off'
  }
}
