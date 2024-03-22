
/* eslint-disable linebreak-style */

module.exports = {
  env: {
    browser: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'next/core-web-vitals', 'next'],
  plugins: ['react'],
  overrides: [
    {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'react/prop-types': 'off',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
