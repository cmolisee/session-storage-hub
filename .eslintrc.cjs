module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	globals: {
		chrome: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'react-hooks'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'array-callback-return': 'error',
		'arrow-body-style': ['error', 'always'],
		curly: ['error', 'all'],
		'default-case': ['error'],
		eqeqeq: ['error', 'always'],
		'no-nested-ternary': ['error'],
		'one-var': ['error', 'never'],
		'prefer-const': [
			'error',
			{ destructuring: 'any', ignoreReadBeforeAssign: false },
		],
		'no-with': 'error',
		'no-var': 'error',
		'react-hooks/exhaustive-deps': 'off',
	},
};
