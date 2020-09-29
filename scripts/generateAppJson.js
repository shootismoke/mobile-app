#!/usr/bin/env node

/**
 * This script will take the `app.example.json` file from the root folder, and
 * override the default values with ones that are in the environment variables.
 * The output will be `app.json` in the root folder.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const merge = require('lodash/merge');

const defaultAppJson = require('../app.example.json');
const pkgJson = require('../package.json');

const STAGING_BACKEND_URL = 'https://staging.shootismoke.now.sh/api/graphql';

const overrides = {
	expo: {
		android: {
			config: {
				googleMaps: {
					apiKey: process.env.SIS_ANDROID_GOOGLE_MAPS_KEY,
				},
			},
		},
		extra: {
			aqicnToken: process.env.SIS_AQICN_TOKEN,
			amplitudeApiKey: process.env.SIS_AMPLITUDE_API_KEY || null,
			backendUrl: process.env.SIS_BACKEND_URL || STAGING_BACKEND_URL,
			hawkKey: process.env.SIS_HAWK_KEY,
			sentryPublicDsn: process.env.SIS_SENTRY_PUBLIC_DNS || null,
		},
		hooks: {
			postPublish: [
				{
					file: 'sentry-expo/upload-sourcemaps',
					config: {
						organization: process.env.SIS_SENTRY_ORG || null,
						project: process.env.SIS_SENTRY_PROJECT || null,
						authToken: process.env.SIS_SENTRY_AUTH_TOKEN || null,
					},
				},
			],
		},
		ios: {
			buildNumber: pkgJson.version,
			config: {
				googleMapsApiKey: process.env.SIS_IOS_GOOGLE_MAPS_KEY,
			},
		},
		version: pkgJson.version,
	},
};

// Add link to `google-services.json`, if ENV variable is set.
const googleServices = process.env.SIS_GOOGLE_SERVICES_JSON
	? {
			expo: {
				android: {
					googleServicesFile: './google-services.json',
				},
			},
	  }
	: {};

console.log(JSON.stringify(merge(defaultAppJson, overrides, googleServices)));
