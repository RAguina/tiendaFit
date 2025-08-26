import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      // Basic rules that work without TypeScript parser
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'prefer-const': 'warn'
    }
  },
  {
    files: ['src/app/**/page.{js,jsx,ts,tsx}', 'src/app/**/layout.{js,jsx,ts,tsx}'],
    rules: {
      // Next.js specific rules
      'import/no-default-export': 'off'
    }
  }
];