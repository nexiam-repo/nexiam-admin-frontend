import { FlatCompat } from '@eslint/eslintrc';
import configPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
  // import.meta.dirname is available in Node.js v20.11.0 and later.
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Turn off unused-vars from TypeScript as we'll use unused-imports
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      // Disable built-in sorting rules to avoid conflicts.
      'sort-imports': 'off',
      'import/order': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  }),
  /*
  TODO: 
  - Improve eslint-import plugin rules and integration.
  */
  {
    plugins: {
      'eslint-import': importPlugin.flatConfigs.recommended,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
    },
  },
  // Add Prettier config as the last item so it overrides any conflicting rules.
  configPrettier,
];

export default eslintConfig;
