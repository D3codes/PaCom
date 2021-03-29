module.exports = {
	env: {
		browser: true,
		es6: true,
		'jest/globals': true
	},
	extends: [
		'plugin:react/recommended',
		'airbnb'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	plugins: [
		'react',
		'jest'
	],
	rules: {
		'react/jsx-filename-extension': 'off',
		'linebreak-style': 'off',
		'comma-dangle': ['warn', 'never'],
		indent: ['warn', 'tab'],
		'no-tabs': 'off',
		'max-len': ['warn', 180],
		'react/jsx-indent': 'off',
		'react/jsx-one-expression-per-line': 'off',
		'react/jsx-indent-props': 'off',
		'react/require-default-props': ['error', { ignoreFunctionalComponents: true }],
		'import/prefer-default-export': 'off',
		'react/jsx-closing-bracket-location': [1, { selfClosing: 'tag-aligned', nonEmpty: 'after-props' }],
		'react/jsx-fragments': [1, 'element'],
		'arrow-parens': ['error', 'as-needed']
	}
};
