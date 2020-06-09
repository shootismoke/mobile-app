module.exports = {
	...require('@amaurymartiny/eslintrc'),
	// FIXME Turn these rules on again:
	// https://github.com/amaurymartiny/shoot-i-smoke/issues/619
	rules: {
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
};
