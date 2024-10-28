import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

// Set up __dirname and __filename equivalents in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    // Load the @react-native recommended config as a base
    ...compat.extends('@react-native'),
    // Extend with additional plugins and settings
    {

        files: ['**/*.ts', '**/*.tsx'], // Apply this configuration only to .ts and .tsx files
        plugins: {
            '@typescript-eslint': typescriptEslint,
            react,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'prefer-const': 'off',
            'react/react-in-jsx-scope': 'off', // Disable need for React to be in scope
            'react/prop-types': 'off', // Disable prop-types validation (using TypeScript)
            'react-native/no-inline-styles': 'off', // Disable inline styles
            'no-shadow': 'off', // Disable shadowing variables
            'react-hooks/exhaustive-deps': 'off', // Disable exhaustive-deps rule
            '@typescript-eslint/no-shadow' : 'off',
        },
    },
];
