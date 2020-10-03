const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
	...tsjPreset,
	preset: 'jest-expo',
	moduleFileExtensions: ['js', 'ts', 'tsx'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	moduleNameMapper: {
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/mocks/fileMock.js',
	},
	transform: {
		...tsjPreset.transform,
	},
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
	],
	globals: {
		'ts-jest': {
			babelConfig: true,
		},
	},
};
