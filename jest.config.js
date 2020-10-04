/* eslint-disable */
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
	...tsjPreset,
	preset: 'jest-expo',
	moduleFileExtensions: ['js', 'ts', 'tsx'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	// Mock static asset imports.
	// https://jestjs.io/docs/en/webpack#handling-static-assets
	moduleNameMapper: {
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/mocks/fileMock.js',
	},
	transform: {
		...tsjPreset.transform,
	},
	// blacklist any unwanted modules that get transpiled, like sentry
	// https://docs.expo.io/guides/testing-with-jest/#jest-configuration
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)',
	],
	globals: {
		'ts-jest': {
			babelConfig: true, // Globals with ts-jest config to look for babel config.
		},
	},
};
