module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
  },
  env: {
    'node': true,
    'jest': true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'warn',
    '@typescript-eslint/no-explicit-any': ["warn", { "ignoreRestArgs": false }],

    'no-console': ['error', { 'allow': ['info', 'warn', 'error'] }],
  }
};