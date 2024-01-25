module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12
  },
  plugins: [
    'react'
  ],
  settings: {
    react: {
      version: '17.0.1'
    }
  },
  rules: {
    // semi: ['error', 'never'],
    // 'comma-dangle': ['error', 'never'],
    // 'no-underscore-dangle': 0,
    // 'max-len': 0,
    // 'import/no-cycle': 0,
    // 'react/prop-types': 0,
    // 'no-nested-ternary': 0,
    // 'linebreak-style': 0
  }
}
