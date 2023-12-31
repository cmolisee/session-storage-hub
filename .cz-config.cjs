module.exports = {
	types: [
		{ value: 'update', name: '✨ update' },
		{ value: 'fix', name: '🐛 fix' },
		{ value: 'breaking', name: '🚨 breaking' },
		{ value: 'new', name: '📦 new' },
		{ value: 'docs', name: '📝 docs' },
		{ value: 'chore', name: '🚚 chore' },
	],
	messages: {
		type: "Select the type of change that you're committing:",
		customScope: 'Denote the SCOPE of this change (optional):',
		subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
		body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
		breaking: 'List any BREAKING CHANGES (optional):\n',
		footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
		confirmCommit:
			'Are you sure you want to proceed with the commit above?',
	},
	allowCustomScopes: true,
	allowBreakingChanges: ['update', 'fix', 'breaking', 'new'],
	breaklineChar: '|',
	skipQuestions: ['scope'],
	subjectLimit: 500,
};
