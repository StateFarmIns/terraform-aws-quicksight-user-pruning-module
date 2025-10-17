const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')

module.exports = [
	{
		files: ['**/*.ts'],
		ignores: ['dist/', 'node_modules/'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2021,
			sourceType: 'module',
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			indent: ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'quote-props': ['error', 'as-needed'],
			'object-curly-spacing': ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
]
