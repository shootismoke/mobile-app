# Shoot! I Smoke

Know how many cigarettes you smoke based on the pollution of your location.

[![Travis (.org)](https://img.shields.io/travis/amaurymartiny/shoot-i-smoke.svg)](https://travis-ci.org/amaurymartiny/shoot-i-smoke)
![GitHub](https://img.shields.io/github/license/amaurymartiny/shoot-i-smoke.svg)
[![David](https://img.shields.io/david/amaurymartiny/shoot-i-smoke.svg)](https://david-dm.org/amaurymartiny/shoot-i-smoke)

[![app-store](https://shootismoke.github.io/assets/images/app-store.png)](https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8) [![google-play](https://shootismoke.github.io/assets/images/play-store.png)](https://play.google.com/store/apps/details?id=com.shitismoke.app)

## Screenshots

<img src="https://lh3.googleusercontent.com/_5krR5h3Swz3rVYwIEX1xBI6rcKzqoagRkmHxk1gn3dyF8NAUO3CRLHyi9WrySf1Rd0=w2836-h1506" alt="screenshot-1" width="100">
<img src="https://lh3.googleusercontent.com/LdpBxKgzW-1DjItGLXYZFoZWMTQ-kztkZ71Er17ccF2vH2tyAdmrQGUVoo8te6Irzwo=w2836-h1506" alt="screenshot-2" width="100">
<img src="https://lh3.googleusercontent.com/qfn2N3e2MzMzB1dow033ZhTzOOwlkleIrf7mHmzqjP31MoAhhbr9OL2NMJz0mPqcioDI=w2836-h1506" alt="screenshot-3" width="100">
<img src="https://lh3.googleusercontent.com/5195BJzKqOx70RHIUlevBoiAuDbYdTaL0c38khQynDNKQCpSc317lBHzatjH-F2dsQ=w2836-h1506" alt="screenshot-4" width="100">
<img src="https://lh3.googleusercontent.com/_5krR5h3Swz3rVYwIEX1xBI6rcKzqoagRkmHxk1gn3dyF8NAUO3CRLHyi9WrySf1Rd0=w2836-h1506" alt="screenshot-5" width="100">

## Try it on Expo

This app is bootstrapped with [Expo](https://expo.io), you can download the Expo app on the [App Store](https://itunes.apple.com/us/app/expo-client/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent), and enter the url provided below. We have 2 release channels:

| Release Channel | Description                                                                 | Url                                                                        |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Production      | Same version as Sh\*\*t! I Smoke on the App Store and Play Store.           | `https://exp.host/@amaurymartiny/shoot-i-smoke?release-channel=production` |
| Staging         | Latest version currently in development: newest features, may contain bugs. | `https://exp.host/@amaurymartiny/shoot-i-smoke`                            |

## Contribute

If you find a bug, or if you have an idea of a cool feature, please file an issue here. We really appreciate feedback and inputs.

If you would like to help coding please read the Getting Started guide.

### Getting Started

Before developing the app, you need to fetch your own API tokens for the following services:

| Service                 | Url                                                                                 | Comments                                                |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| World Air Quality Index | http://aqicn.org/api/                                                               | Required.                                               |
| Google Geocoding        | https://developers.google.com/maps/documentation/geocoding/intro                    | Optional, but recommended for showing precise location. |
| Algolia Places          | https://community.algolia.com/places/rest.html (`Get Started` button on the bottom) | Optional, lower API rates if not provided.              |
| Google Maps for iOS     | https://developers.google.com/maps/documentation/ios-sdk/start                      | Optional in development.                                |
| Google Maps for Android | https://developers.google.com/maps/documentation/android-api/                       | Optional in development.                                |

Then run the following commands:

```bash
git clone https://github.com/amaurymartiny/shoot-i-smoke
cd shoot-i-smoke
yarn install

cp app.example.json app.json # Replace the API keys placeholders with your own tokens in app.json

yarn start
```

This app is created with Expo, using React Native. When you run `yarn start`, the Expo packager will show, and you can either:

- install the Expo app, scan the displayed QR code, and run the app on your mobile phone directly.
- open the Android simulator.
- open the iOS simulator.

All the code lives in the `App/` folder. The app itself is pretty small, so it should be fairly easy to navigate through the files.

## License

GPL-3.0. See LICENSE file for more information.

## Credits

Created with ❤ by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://www.toptal.com/resume/amaury-martiny#utilize-unreal-developers-today).
