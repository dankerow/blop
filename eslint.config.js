import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    languageOptions: {
      parserOptions: {
        project: true
      }
    }
  },
  {
    ignores: [
      'eslint.config.js',
    ]
  },
  {
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': [
          '.ts', '.tsx'
        ]
      },
      'import/resolver': {
        node: {
          extensions: [
            '.js', '.mjs', '.ts', '.d.ts'
          ]
        },
        typescript: {}
      }
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error', { 'ts-ignore': 'allow-with-description' }
      ],
      '@typescript-eslint/member-delimiter-style': [
        'error',
        { multiline: { delimiter: 'none' } }
      ],
      '@typescript-eslint/type-annotation-spacing': [
        'error',
        {}
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error', { 'prefer': 'type-imports', disallowTypeAnnotations: false }
      ],
      '@typescript-eslint/consistent-type-definitions': [
        'error',
        'interface'
      ],
      '@typescript-eslint/prefer-ts-expect-error': 'error',

      // off
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-useless-constructor': 'off',

      '@stylistic/ts/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          MemberExpression: 1,
          FunctionDeclaration: {
            parameters: 1,
            body: 1
          },
          FunctionExpression: {
            parameters: 1,
            body: 1
          },
          CallExpression: {
            arguments: 1
          },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false,
          ignoredNodes: [
            'TemplateLiteral *',
            'JSXElement',
            'JSXElement > *',
            'JSXAttribute',
            'JSXIdentifier',
            'JSXNamespacedName',
            'JSXMemberExpression',
            'JSXSpreadAttribute',
            'JSXExpressionContainer',
            'JSXOpeningElement',
            'JSXClosingElement',
            'JSXFragment',
            'JSXOpeningFragment',
            'JSXClosingFragment',
            'JSXText',
            'JSXEmptyExpression',
            'JSXSpreadChild',
            'TSTypeParameterInstantiation',
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
          ],
          offsetTernaryExpressions: true
        }
      ],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          variables: true
        }
      ],

      '@stylistic/ts/brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true
        }
      ],

      '@stylistic/ts/comma-dangle': [
        'error'
      ],

      '@stylistic/ts/object-curly-spacing': [
        'error',
        'always'
      ],

      '@stylistic/ts/semi': [
        'error',
        'never'
      ],

      '@stylistic/ts/quotes': [
        'error',
        'single'
      ],

      '@stylistic/ts/space-before-blocks': [
        'error',
        'always'
      ],

      '@stylistic/ts/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],

      '@stylistic/ts/space-infix-ops': 'error',
      '@stylistic/ts/keyword-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],

      '@stylistic/ts/comma-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],

      '@stylistic/ts/no-extra-parens': [
        'error',
        'functions'
      ],
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error',
      'no-loss-of-precision': 'off',
      '@typescript-eslint/no-loss-of-precision': 'error',
      '@stylistic/ts/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true
        }
      ]
    }
  }
)
