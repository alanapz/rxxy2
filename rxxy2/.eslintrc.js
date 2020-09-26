module.exports = {
  'env': {
    'browser': true,
    'es2020': true
  },
  'extends': [
    'plugin:@typescript-eslint/all',
    'plugin:@angular-eslint/all'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'plugins': [
    '@typescript-eslint',
    '@angular-eslint/eslint-plugin',
    'eslint-plugin-codelyzer',
    'eslint-plugin-rxjs',
    'eslint-plugin-rxjs-angular'
  ],
  'rules': {

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
    '@typescript-eslint/ban-types': ['warn', {
      'extendDefaults': true,
      'types': {
        'object': false,
        'Object': false
      }
    }],
    '@typescript-eslint/brace-style': 'warn',
    '@typescript-eslint/comma-spacing': 'off', // Rule seems unnecessary
    '@typescript-eslint/dot-notation': 'off', // Too many Angular components require dot access (eg: SimpleChanges)
    '@typescript-eslint/explicit-function-return-type': ['error', {
      'allowExpressions': true
    }],
    '@typescript-eslint/explicit-member-accessibility': 'off', // A lot of Angular assumes no modifier == public
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Seems to be too strict, breaks pretty much everything (and conflicts with explicit-function-return-type)
    '@typescript-eslint/func-call-spacing': 'warn',
    '@typescript-eslint/keyword-spacing': 'warn',
    '@typescript-eslint/indent': 'off', // Difficult to choose an indenting style compatible between all types of projects
    '@typescript-eslint/init-declarations': 'warn',
    '@typescript-eslint/lines-between-class-members': 'off', // Sometimes cleaner to group related members together
    '@typescript-eslint/member-delimiter-style': ['error', {
      'multiline': {
        'delimiter': 'semi',
        'requireLast': true
      },
      'singleline': {
        'delimiter': 'semi',
        'requireLast': false
      }
    }],
    '@typescript-eslint/member-ordering': 'off', // Sometimes it's better to group similar methods together
    '@typescript-eslint/naming-convention': ['error', {
      'selector': 'enumMember',
      'format': ['camelCase', 'UPPER_CASE', 'PascalCase']
    }, {
      'selector': 'property', // Legacy reasons
      'format': ['camelCase', 'UPPER_CASE', 'snake_case']
    }],
    '@typescript-eslint/no-explicit-any': 'off', // We often need to type objects as any
    '@typescript-eslint/no-extra-parens': 'off', // We lose readability
    '@typescript-eslint/no-extraneous-class': 'off', // A lot of Angular modules are empty classes
    '@typescript-eslint/no-inferrable-types': 'off', // We lose readability
    '@typescript-eslint/no-invalid-this': 'off', // Too many false positives
    '@typescript-eslint/no-floating-promises': 'off', // Too many Angular functions return promises
    '@typescript-eslint/no-magic-numbers': 'off', // Too many false positives
    '@typescript-eslint/no-parameter-properties': 'off', // Too many false positives
    '@typescript-eslint/no-unnecessary-condition': 'off', // Too many false positives, needs null-safe typing everywhere
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'off', // We should explicitly specify default type parameters
    '@typescript-eslint/no-unused-vars': 'off', // Too many false positives
    '@typescript-eslint/no-unused-vars-experimental': ['error', {
      'ignoreArgsIfArgsAfterAreUsed': true
    }],
    '@typescript-eslint/no-type-alias': 'off', // It's often useful to create our own type aliases
    '@typescript-eslint/prefer-optional-chain': 'off', // A great idea but too much legacy code (x && xx.y)
    '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too many false positives
    '@typescript-eslint/promise-function-async': 'off', // Too many Angular functions return promises (everything to do with router, form handling, etc)
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'never'
    }],
    '@typescript-eslint/strict-boolean-expressions': 'off', // A great idea but breaks too much code (!0 for example)
    '@typescript-eslint/restrict-template-expressions': 'off', // Seem to lose too much readability
    '@typescript-eslint/typedef': ['error', {
      'arrowParameter': false,
      'memberVariableDeclaration': false
    }],
    '@typescript-eslint/unbound-method': 'error',

    '@angular-eslint/contextual-lifecycle': 'error',
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-lifecycle-call': 'error',
    '@angular-eslint/no-output-native': 'error',
    '@angular-eslint/no-pipe-impure': 'error',
    '@angular-eslint/prefer-on-push-component-change-detection': 'off', // Too many components use old-style system
    '@angular-eslint/prefer-output-readonly': 'error',
    '@angular-eslint/relative-url-prefix': 'error',
    '@angular-eslint/use-component-selector': 'off', // Too many components don't have explicit selectors (router-outlet / abstract components)
    '@angular-eslint/use-injectable-provided-in': 'off', // Too many false positives
    '@angular-eslint/use-lifecycle-interface': 'off', // Too many false positives (doesn't look at subclasses / superclasses)

    // https://www.npmjs.com/package/eslint-plugin-rxjs
    'rxjs/just': 'error',
    'rxjs/no-async-subscribe': 'error',
    'rxjs/no-compat': 'off', // Many projects require compat libraries
    'rxjs/no-create': 'error',
    'rxjs/no-explicit-generics': 'off', // Unable to see why this is a problem ?
    'rxjs/no-exposed-subjects': 'warn',
    'rxjs/no-finnish': 'off', // Seems terrible.. ( https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b )
    'rxjs/no-ignored-error': 'error',
    'rxjs/no-ignored-notifier': 'off', // Seems to cause too many false positives
    'rxjs/no-ignored-observable': 'off', // Too many false positives (Angular routing / forms / etc)
    'rxjs/no-ignored-replay-buffer': 'error',
    'rxjs/no-ignored-subscribe': 'error',
    'rxjs/no-ignored-subscription': 'off', // Far too heavy
    'rxjs/no-ignored-takewhile-value': 'off', // Unclear as to whether it's useful ?
    'rxjs/no-index': 'off', // Some projects require index imports
    'rxjs/no-internal': 'off', // Far too many false positives + unmapped classes (filter?)
    'rxjs/no-connectable': 'warn',
    'rxjs/no-nested-subscribe': 'warn',
    'rxjs/no-redundant-notify': 'error',
    'rxjs/no-sharereplay': 'warn', // (https://github.com/cartant/rxjs-tslint-rules/issues/78) - prefer Subjets to shareReplay
    'rxjs/no-subclass': 'error',
    'rxjs/no-subject-unsubscribe': 'error', // ( https://ncjamieson.com/closed-subjects/ )
    'rxjs/no-subject-value': 'warn',
    'rxjs/no-tap': 'warn', // Sometimes useful ... Seems drastic to ban
    'rxjs/no-topromise': 'warn',
    'rxjs/no-unbound-methods': 'warn',
    'rxjs/no-unsafe-catch': 'warn', // See https://medium.com/city-pantry/handling-errors-in-ngrx-effects-a95d918490d9
    'rxjs/no-unsafe-first': 'warn',
    'rxjs/no-unsafe-subject-next': 'off', // Unsure as to the point ?
    'rxjs/no-unsafe-switchmap': 'off', // Too many false positives
    'rxjs/no-unsafe-takeuntil': 'error', // Wow! https://medium.com/angular-in-depth/rxjs-avoiding-takeuntil-leaks-fb5182d047ef
    'rxjs/prefer-observer': 'error',
    'rxjs/throw-error': 'off' // Too strict - see https://github.com/cartant/rxjs-tslint-rules/issues/85
  }
};
