module.exports = {
	...require('@amaurym/eslintrc'),
	// FIXME Turn these rules on again:
	// https://github.com/amaurym/shoot-i-smoke/issues/619
	rules: {
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
};
