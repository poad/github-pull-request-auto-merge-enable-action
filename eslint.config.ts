import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

// @ts-expect-error: No types
import github from 'eslint-plugin-github';

import { configs } from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/*.d.ts',
      '*.{js,jsx}',
      'node_modules/**/*',
      'dist',
    ],
  },
  eslint.configs.recommended,
  ...configs.strict,
  ...configs.stylistic,
  {
    files: ['src/**/*.ts', 'app/**/*.{js,jsx,ts,tsx}'],
    extends: [
      ...configs.recommended,
    ],
    plugins: {
      '@stylistic': stylistic,
      github,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig-eslint.json'],
      },
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      'max-len': ['error', 80],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
);
