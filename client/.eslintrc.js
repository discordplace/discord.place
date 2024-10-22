
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next',
    'plugin:depend/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:security/recommended-legacy',
    'plugin:perfectionist/recommended-natural-legacy'
  ],
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
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'perfectionist'],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true
      }
    ],
    'brace-style': [
      'error',
      '1tbs',
      { allowSingleLine: true }
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'default-param-last': 'error',
    'depend/ban-dependencies': [
      2,
      {
        allowed: [
          'moment',
          'lodash'
        ]
      }
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'func-style': [
      'error',
      'declaration',
      { allowArrowFunctions: true }
    ],
    indent: [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'key-spacing': [
      'error',
      {
        afterColon: true,
        beforeColon: false
      }
    ],
    'keyword-spacing': [
      'error',
      { after: true, before: true }
    ],
    'linebreak-style': 'off',
    'newline-before-return': 'error',
    'no-duplicate-imports': [
      'error',
      { includeExports: true }
    ],
    'no-empty-function': 'error',
    'no-lonely-if': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      { max: 1 }
    ],
    'no-return-assign': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-return': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    quotes: [
      'error',
      'single'
    ],
    'react/jsx-indent-props': ['error', 2],
    'react/prop-types': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false
      }
    ],
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-object-injection': 'off',
    'security/detect-unsafe-regex': 'off',
    semi: [
      'error',
      'always'
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'space-infix-ops': 'error',
    'spaced-comment': [
      'error',
      'always',
      { markers: ['/'] }
    ],
    'template-curly-spacing': [
      'error',
      'never'
    ]
  }
};
