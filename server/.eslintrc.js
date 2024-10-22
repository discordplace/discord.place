/* eslint-disable linebreak-style */

module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:depend/recommended',
    'plugin:security/recommended-legacy',
    'plugin:perfectionist/recommended-natural-legacy'
  ],
  globals: {
    client: 'readonly',
    config: 'readonly',
    i18n: 'readonly',
    logger: 'readonly'
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
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['ban', 'perfectionist'],
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
    'ban/ban': [
      2,
      {
        'message': 'Use a global logger methods instead. E.g. logger.info()',
        'name': ['console', '*']
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
          'lodash.shuffle'
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
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix'
    ],
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
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-non-literal-require': 'off',
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