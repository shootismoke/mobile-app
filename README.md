# Sh\*\*t! I Smoke

Know how many cigarettes you smoke based on the pollution of your location. :poop::smoking:

[![Actions Status](https://github.com/amaurymartiny/shoot-i-smoke/workflows/CI/badge.svg)](https://github.com/amaurymartiny/shoot-i-smoke/actions)
![GitHub](https://img.shields.io/github/license/amaurymartiny/shoot-i-smoke.svg)
[![David](https://img.shields.io/david/amaurymartiny/shoot-i-smoke.svg)](https://david-dm.org/amaurymartiny/shoot-i-smoke)
[![Maintainability](https://api.codeclimate.com/v1/badges/9fc8ebb000978f14b6d0/maintainability)](https://codeclimate.com/github/amaurymartiny/shoot-i-smoke/maintainability)
[![](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/amaurymartiny)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/shootismoke)

[![app-store](https://shootismoke.github.io/assets/images/app-store.png)](https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8) [![google-play](https://shootismoke.github.io/assets/images/play-store.png)](https://play.google.com/store/apps/details?id=com.shitismoke.app)

## :camera: Screenshots

<p float="left">
  <img src="./assets/screenshots/ios/iPhone-X-1.png" alt="screenshot-1" width="150">
  <img src="./assets/screenshots/ios/iPhone-X-2.png" alt="screenshot-2" width="150">
  <img src="./assets/screenshots/ios/iPhone-X-3.png" alt="screenshot-3" width="150">
  <img src="./assets/screenshots/ios/iPhone-X-4.png" alt="screenshot-4" width="150">
  <img src="./assets/screenshots/ios/iPhone-X-5.png" alt="screenshot-5" width="150">
</p>

## 😷 Air Pollution

Air pollution is a burning issue facing our planet today. Rapid industrialization and urbanization has made the problem extremely difficult to contain. Cities around the world are witnessing rising levels of air contamination, with Beijing, Kanpur and New Delhi recording some of the worst figures in recent years.

Air pollution has dire implications on human health and well-being. It affects plant and animal life, and also disrupts the ecosystem. It changes our environment irreversibly, often leaving it beyond repair. This calls for an urgent need to curb air pollution.

There are various things we can do to eliminate the causes and minimize the effects of air pollution. There is a macro and a micro level to dealing with pollution. While the government and the private sector need to rethink policies for controlling air pollution on a broader scale, we as citizens can fight air pollution in our homes and offices by installing air quality monitors and air purification devices.

## :iphone: Try it on Expo

This app is bootstrapped with [Expo](https://expo.io), you can download the Expo app on the [App Store](https://itunes.apple.com/us/app/expo-client/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent), and enter the url provided below. We have 2 release channels:

| Release Channel                                                                               | Version | Description                                                                 | Url                                                                               |
| --------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Production](https://exp.host/@amaurymartiny/shoot-i-smoke?release-channel=production-v1.4.2) | v1.4.2  | Same version as Sh\*\*t! I Smoke on the App Store and Play Store.           | `https://exp.host/@amaurymartiny/shoot-i-smoke?release-channel=production-v1.4.2` |
| [Staging](https://exp.host/@amaurymartiny/shoot-i-smoke)                                      | v1.5.0  | Latest version currently in development: newest features, may contain bugs. | `https://exp.host/@amaurymartiny/shoot-i-smoke`                                   |

## :hammer: Build it yourself

Before developing the app, you need to fetch your own API tokens for the following services:

| Service                  | Url                                                                        | Comments                                                                   |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Sh\*\*t! I Smoke Backend | https://github.com/shootismoke/backend                                     | Required. Pre-filled with a staging token.                                 |
| World Air Quality Index  | http://aqicn.org/api/                                                      | Required. You can use the dummy one in `app.example.json` for development. |
| Algolia Places           | https://community.algolia.com/places/ (`Get Started` button on the bottom) | Optional, lower API rates if not provided.                                 |
| Google Maps for iOS      | https://developers.google.com/maps/documentation/ios-sdk/start             | Optional in development.                                                   |
| Google Maps for Android  | https://developers.google.com/maps/documentation/android-api/              | Optional in development.                                                   |
| Sentry Bug Tracking      | https://sentry.io                                                          | Optional.                                                                  |
| Amplitude Analytics      | https://amplitude.com                                                      | Optional. Note: we **never** track PII.                                    |

Then run the following commands:

```bash
git clone https://github.com/amaurymartiny/shoot-i-smoke
cd shoot-i-smoke
yarn install

# Copy the file that contains secrets
cp app.example.json app.json

yarn start
```

In `app.json`, replace all the placeholders for API keys and tokens with the ones you generated for yourself. For those that are optional, you can just put `null` (without quotes).

This app is created with Expo, using React Native. When you run `yarn start`, the Expo packager will show, and you can either:

- install the Expo app, scan the displayed QR code, and run the app on your mobile phone directly.
- open the Android simulator.
- open the iOS simulator.

All the code lives in the `App/` folder. The app itself is pretty small, so it should be fairly easy to navigate through the files.

## :raising_hand: Contribute

If you find a bug, or if you have an idea for this app, please file an issue [here](https://github.com/amaurymartiny/shoot-i-smoke/issues). We really appreciate feedback and inputs!

🇬🇧🇫🇷🇪🇸🇨🇳 You may also contribute with translations with our online tool [POEditor](https://poeditor.com/join/project/iEsj0CSPGX).

For code contribution, the codebase heavily relies on functional programming principles via the [`fp-ts`](https://github.com/gcanti/fp-ts) library. The codebase itself is quite simple, so even if you're beginner to functional programming, it shouldn't be hard to follow along.

More information on contributing [here](./CONTRIBUTING.md).

## :microscope: Tests

The codebase unfortunately isn't much covered by tests. Check out the `*.spec.js` files in the project for tests. If you're interested to help out, have a look at [#19](https://github.com/amaurymartiny/shoot-i-smoke/issues/19).

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.

## :star: Credits

Created with ❤ by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://www.toptal.com/resume/amaury-martiny#utilize-unreal-developers-today).

A **huge** thanks to the following contributors for their amazing work:

- [@lucienbl](https://github.com/lucienbl)

---

<a href="https://www.producthunt.com/posts/sh-t-i-smoke?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sh-t-i-smoke" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=126582&theme=light" alt="Sh**t! I Smoke - See your city's air pollution measured in daily cigarettes. | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
