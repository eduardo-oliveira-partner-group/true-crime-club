import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',

      'react-hooks/incompatible-library': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/globals': 'warn',
      'react-hooks/purity': 'warn',

      'better-tailwindcss/enforce-canonical-classes': 'warn',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
