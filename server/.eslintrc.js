/* eslint-disable linebreak-style */

module.exports = {
  env: {
    node: true,
    es2021: true
  },
  globals: {
    client: 'readonly',
    config: 'readonly',
    logger: 'readonly',
    i18n: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:depend/recommended',
    'plugin:security/recommended-legacy'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['ban'],
  rules: {
    indent: [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix'
    ],
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
    'ban/ban': [
      2,
      {
        'name': ['console', '*'],
        'message': 'Use a global logger methods instead. E.g. logger.info()'
      }
    ],
    'depend/ban-dependencies': [
      2,
      {
        allowed: [
          'moment',
          'lodash.shuffle'
        ]
      }
    ],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-unsafe-regex': 'off',
    'security/detect-non-literal-require': 'off'
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'module'
      }
    }
  ]
};