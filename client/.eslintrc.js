
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'next'],
  plugins: ['react'],
  overrides: [
    {
      files: ['*.{js,jsx}'],
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
      { SwitchCase: 1 }
    ],
    'linebreak-style': 'off',
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'comma-dangle': [
      'error',
      'never'
    ]
  }
};
