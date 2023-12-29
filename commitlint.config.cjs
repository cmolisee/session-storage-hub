module.exports = {
	extends: ['eslint'],
	rules: {
		'body-leading-blank': [0, 'always'],
		'body-max-line-length': [0, 'always', 100],
		'footer-leading-blank': [0, 'always'],
		'footer-max-line-length': [0, 'always', 100],
		'header-max-length': [0, 'always', 100],
		'subject-case': [
			2,
			'never',
			['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
		],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [0, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			['breaking', 'fix', 'update', 'new', 'docs', 'chore'],
		],
	},
};
