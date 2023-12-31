module.exports = {
	extends: ['eslint'],
	rules: {
		'body-max-length': [0, 'always'],
		'body-max-line-length': [0, 'always'],
		'footer-max-length': [0, 'always'],
		'footer-max-line-length': [0, 'always'],
		'header-max-length': [0, 'always'],
		'scope-max-length': [0, 'always'],
		'subject-max-length': [0, 'always'],
		'type-max-length': [0, 'always'],
		'footer-leading-blank': [0, 'always'],
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
