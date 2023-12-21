module.exports = {
	rules: {
		'body-leading-blank': [1, 'always'],
		'body-max-line-length': [2, 'always', 100],
		'footer-leading-blank': [1, 'always'],
		'footer-max-line-length': [2, 'always', 100],
		'header-max-length': [2, 'always', 100],
		'subject-case': [
			2,
			'never',
			['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
		],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			[
                'breaking',
                'fix',
                'update',
                'new',
                'docs',
                'chore'
			],
		],
	},
	prompt: {
		settings: {},
		messages: {
			skip: ':skip',
			max: 'upper %d chars',
			min: '%d chars at least',
			emptyWarning: 'can not be empty',
			upperLimitWarning: 'over limit',
			lowerLimitWarning: 'below limit'
		},
		questions: {
			type: {
				description: "Select the type of change that you're committing",
				enum: {
					update: {
						description: 'An Update',
						title: 'update',
						emoji: '✨',
					},
					fix: {
						description: 'A bug fix',
						title: 'fix',
						emoji: '🐛',
					},
					docs: {
						description: 'Documentation only changes',
						title: 'docs',
						emoji: '📚',
					},
					breaking: {
						description: 'A Major change',
                        title: 'breaking',
						emoji: '🚨',
					},
					new: {
						description: 'A new Feature',
						title: 'new',
						emoji: '📦',
					},
					chore: {
						description: "Other changes that don't modify src or test files",
						title: 'Chores',
						emoji: '♻️',
					},
				},
			},
			scope: {
				description:
					'What is the scope of this change (e.g. component or file name)',
			},
			subject: {
				description:
					'Write a short, imperative tense description of the change',
			},
			body: {
				description: 'Provide a longer description of the change',
			},
			isBreaking: {
				description: 'Are there any breaking changes?',
			},
			breakingBody: {
				description:
					'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
			},
			breaking: {
				description: 'Describe the breaking changes',
			},
			isIssueAffected: {
				description: 'Does this change affect any open issues?',
			},
			issuesBody: {
				description:
					'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
			},
			issues: {
				description: 'Add issue references (e.g. "fix #123", "re #123".)',
			},
		},
	},
};