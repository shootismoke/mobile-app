import { config } from 'dotenv';

import pkgJson from './package.json';

config();

module.exports = {
	android: {
		config: {
			googleMaps: {
				apiKey: process.env.ANDROID_GOOGLE_MAPS_KEY,
			},
		},
		icon: 'assets/logos/android/playstore-icon.png',
		package: 'com.shitismoke.app',
		permissions: ['ACCESS_FINE_LOCATION'],
		versionCode: 20,
	},
	assetBundlePatterns: [
		'assets/**/*',
		'./node_modules/@shootismoke/ui/assets/**/*',
	],
	backgroundColor: '#FAFAFC',
	description: "See your city's air pollution measured in daily cigarettes.",
	extra: {
		aqicnToken: process.env.AQICN_TOKEN,
		amplitudeApiKey: process.env.AMPLITUDE_API_KEY,
		backendSecret: process.env.BACKEND_SECRET,
		backendUrl: process.env.BACKEND_URL,
		geoapifyApiKey: process.env.GEOAPIFY_API_KEY,
		sentryPublicDsn: process.env.SENTRY_PUBLIC_DSN,
		eas: {
			projectId: '19ce6a2a-47d4-4737-be57-72a003afa635',
		},
	},
	githubUrl: 'https://github.com/shootismoke/mobile-app',
	hooks: {
		postPublish: [
			{
				file: 'sentry-expo/upload-sourcemaps',
				config: {
					organization: process.env.SENTRY_ORG,
					project: process.env.SENTRY_PROJECT,
					authToken: process.env.SENTRY_AUTH_TOKEN,
				},
			},
		],
	},
	icon: 'assets/logos/ios/iTunesArtwork@3x.png',
	ios: {
		buildNumber: pkgJson.version,
		bundleIdentifier: 'com.shitismoke.app',
		config: {
			usesNonExemptEncryption: false,
			googleMapsApiKey: process.env.IOS_GOOGLE_MAPS_KEY,
		},
		icon: 'assets/logos/ios/iTunesArtwork@3x.png',
		infoPlist: {
			NSLocationWhenInUseUsageDescription:
				'This app uses your location to find the air quality level near you.',
		},
	},
	name: 'Shoot! I Smoke',
	notification: {
		icon: './node_modules/@shootismoke/ui/assets/images/poop.png',
	},
	platforms: ['ios', 'android'],
	primaryColor: '#EBE7DD',
	privacy: 'public',
	slug: 'shootismoke',
	splash: {
		backgroundColor: '#EBE7DD',
		image: 'assets/logos/splash.png',
	},
	version: pkgJson.version,
	runtimeVersion: {
		policy: 'sdkVersion',
	},
	sdkVersion: '47.0.0',
	updates: {
		url: 'https://u.expo.dev/19ce6a2a-47d4-4737-be57-72a003afa635',
	},
};
