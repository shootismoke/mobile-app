module.exports = {
	...require('@amaurym/eslintrc'),
	// FIXME Turn these rules on again:
	// https://github.com/shootismoke/mobile-app/issues/619
	rules: {
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
};
