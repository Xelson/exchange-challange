import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

const stylisticConfigRules = {
  ...stylistic.configs.customize({
    indent: 'tab',
    jsx: true,
    semi: true,
    quoteProps: 'consistent',
    quotes: 'single',
  }).rules,
  '@stylistic/indent-binary-ops': ['off'],
  '@stylistic/jsx-one-expression-per-line': ['off'],
  '@stylistic/jsx-quotes': ['error', 'prefer-single'],
  '@stylistic/multiline-ternary': ['off'],
  '@stylistic/max-len': ['error', {
    code: 150,
    ignoreComments: true,
    ignoreTemplateLiterals: true
  }],
};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...stylisticConfigRules,
    },
    plugins: {
      '@stylistic': stylistic,
    }
  },
])
