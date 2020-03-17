#!/usr/bin/env node

/**
 * This script will take the `app.example.json` file from the root folder, and
 * override the default values with ones that are in the environment variables.
 * The output will be `app.json` in the root folder.
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const jsonfile = require('jsonfile');
const merge = require('lodash/merge');

const defaultAppJson = require('../app.example.json');
const pkgJson = require('../package.json');

const overrides = {
  expo: {
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.SIS_ANDROID_GOOGLE_MAPS_KEY
        }
      }
    },
    extra: {
      aqicnToken: process.env.SIS_AQICN_TOKEN,
      amplitudeApiKey: process.env.SIS_AMPLITUDE_API_KEY || null,
      hawkKey: process.env.SIS_HAWK_KEY,
      sentryPublicDsn: process.env.SIS_SENTRY_PUBLIC_DNS || null
    },
    ios: {
      buildNumber: pkgJson.version,
      config: {
        googleMapsApiKey: process.env.SIS_IOS_GOOGLE_MAPS_KEY
      }
    },
    version: pkgJson.version
  }
};

jsonfile.writeFileSync('app.json', merge(defaultAppJson, overrides));
