
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next',
    'plugin:depend/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:security/recommended-legacy'
  ],
  plugins: ['react'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'react/prop-types': 'off',
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false
      }
    ],
    'react/jsx-indent-props': ['error', 2],
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
    ],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      { max: 1 }
    ],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'brace-style': [
      'error',
      '1tbs',
      { allowSingleLine: true }
    ],
    'no-empty-function': 'error',
    'no-lonely-if': 'error',
    'no-useless-return': 'error',
    'spaced-comment': [
      'error',
      'always',
      { markers: ['/'] }
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'template-curly-spacing': [
      'error',
      'never'
    ],
    'default-param-last': 'error',
    'newline-before-return': 'error',
    'no-duplicate-imports': [
      'error',
      { includeExports: true }
    ],
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'no-return-assign': 'error',
    'object-shorthand': 'error',
    'func-style': [
      'error',
      'declaration',
      { allowArrowFunctions: true }
    ],
    'array-bracket-spacing': ['error', 'never'],
    'space-infix-ops': 'error',
    'keyword-spacing': [
      'error',
      { before: true, after: true }
    ],
    'no-unneeded-ternary': 'error',
    'no-multi-spaces': 'error',
    'depend/ban-dependencies': [
      2,
      {
        allowed: [
          'moment',
          'lodash'
        ]
      }
    ],
    'security/detect-object-injection': 'off'
  },
  overrides: [
    {
      files: ['*.{js,jsx}'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    {
      'files': ['*.jsx'],
      'rules': {
        'no-duplicate-imports': 'off'
      }
    }
  ]
};
