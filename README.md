# Sh\*\*t! I Smoke

Know how many cigarettes you smoke based on the pollution of your location. :poop::smoking:

[![Travis (.org)](https://img.shields.io/travis/amaurymartiny/shoot-i-smoke.svg)](https://travis-ci.org/amaurymartiny/shoot-i-smoke)
![GitHub](https://img.shields.io/github/license/amaurymartiny/shoot-i-smoke.svg)
[![David](https://img.shields.io/david/amaurymartiny/shoot-i-smoke.svg)](https://david-dm.org/amaurymartiny/shoot-i-smoke)

[![app-store](https://shootismoke.github.io/assets/images/app-store.png)](https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8) [![google-play](https://shootismoke.github.io/assets/images/play-store.png)](https://play.google.com/store/apps/details?id=com.shitismoke.app)

## :camera: Screenshots

<p float="left">
  <img src="https://lh3.googleusercontent.com/_5krR5h3Swz3rVYwIEX1xBI6rcKzqoagRkmHxk1gn3dyF8NAUO3CRLHyi9WrySf1Rd0=w2836-h1506" alt="screenshot-1" width="150">
  <img src="https://lh3.googleusercontent.com/LdpBxKgzW-1DjItGLXYZFoZWMTQ-kztkZ71Er17ccF2vH2tyAdmrQGUVoo8te6Irzwo=w2836-h1506" alt="screenshot-2" width="150">
  <img src="https://lh3.googleusercontent.com/qfn2N3e2MzMzB1dow033ZhTzOOwlkleIrf7mHmzqjP31MoAhhbr9OL2NMJz0mPqcioDI=w2836-h1506" alt="screenshot-3" width="150">
  <img src="https://lh3.googleusercontent.com/5195BJzKqOx70RHIUlevBoiAuDbYdTaL0c38khQynDNKQCpSc317lBHzatjH-F2dsQ=w2836-h1506" alt="screenshot-4" width="150">
  <img src="https://lh3.googleusercontent.com/_5krR5h3Swz3rVYwIEX1xBI6rcKzqoagRkmHxk1gn3dyF8NAUO3CRLHyi9WrySf1Rd0=w2836-h1506" alt="screenshot-5" width="150">
</p>

## :iphone: Try it on Expo

This app is bootstrapped with [Expo](https://expo.io), you can download the Expo app on the [App Store](https://itunes.apple.com/us/app/expo-client/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent), and enter the url provided below. We have 2 release channels:

| Release Channel | Version | Description                                                                 | Url                                                                        |
| --------------- | ------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Production      | v1.3.1  | Same version as Sh\*\*t! I Smoke on the App Store and Play Store.           | `https://exp.host/@amaurymartiny/shoot-i-smoke?release-channel=production` |
| Staging         | v1.3.1  | Latest version currently in development: newest features, may contain bugs. | `https://exp.host/@amaurymartiny/shoot-i-smoke`                            |

## :hammer: Build it yourself

Before developing the app, you need to fetch your own API tokens for the following services:

| Service                 | Url                                                                                 | Comments                                                |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| World Air Quality Index | http://aqicn.org/api/                                                               | Required.                                               |
| LocationIQ              | https://locationiq.com/                                                             | Optional, but recommended for showing precise location. |
| Algolia Places          | https://community.algolia.com/places/rest.html (`Get Started` button on the bottom) | Optional, lower API rates if not provided.              |
| Google Maps for iOS     | https://developers.google.com/maps/documentation/ios-sdk/start                      | Optional in development.                                |
| Google Maps for Android | https://developers.google.com/maps/documentation/android-api/                       | Optional in development.                                |
| Sentry Bug Tracking     | https://sentry.io                                                                   | Optional.                                               |

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

## :raising_hand: Contribute

If you find a bug, or if you have an idea for this app, please file an issue [here](https://github.com/amaurymartiny/shoot-i-smoke/issues). We really appreciate feedback and inputs!

🇬🇧🇫🇷🇪🇸🇨🇳 You may also contribute with translations with our online tool [POEditor](https://poeditor.com/join/project/iEsj0CSPGX).

More information on contributing [here](./CONTRIBUTING.md).

## :microscope: Tests

The codebase unfortunately isn't much covered by tests. Check out the `*.spec.js` files in the project for tests. If you're interested to help out, have a look at [#19](https://github.com/amaurymartiny/shoot-i-smoke/issues/19).

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.

## :star: Credits

Created with ❤ by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://www.toptal.com/resume/amaury-martiny#utilize-unreal-developers-today).
