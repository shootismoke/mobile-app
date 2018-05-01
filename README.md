# Sh\*t! I Smoke

Know how many cigarettes you smoke based on the pollution of your location.

[![app-store](https://shitismoke.github.io/assets/images/app-store.png)](https://itunes.apple.com/us/app/s-i-smoke/id1365605567?mt=8) [![google-play](https://shitismoke.github.io/assets/images/play-store.png)](https://play.google.com/store/apps/details?id=com.shitismoke.app)

## Screenshots

![screenshot-1](https://lh3.googleusercontent.com/BLVtUTguTcE7J1oeovfQhu1OI7jChczWv-evW2QgYlD8Dcv-66oGe4Th6O_soGP9SPA=w720-h310) ![screenshot-2](https://lh3.googleusercontent.com/XJTcPDB211FAJVFRpxxePlItSUy4rrZepOmRVZlM9kiF6DIorSOSfaFH1-0tSsQauw=w720-h310) ![screenshot-3](https://lh3.googleusercontent.com/j5-atGUl2UlY7UOF0x3dLA-qR9QWW8IdGmA8ZsBY06_W-W3uMDYzCprt5E2AdGdPiA=w720-h310)

## Try it on Expo

This app is bootstrapped with [Expo](https://expo.io), you can download the Expo app on the [App Store](https://itunes.apple.com/us/app/expo-client/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent), and enter the url provided below. We have 2 release channels:

| Release Channel | Description                                                                 | Url                                                                       |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Production      | Same version as Sh\*t! I Smoke on the App Store and Play Store.             | `https://exp.host/@amaurymartiny/shit-i-smoke?release-channel=production` |
| Staging         | Latest version currently in development: newest features, may contain bugs. | `https://exp.host/@amaurymartiny/shit-i-smoke`                            |

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
git clone https://github.com/amaurymartiny/shit-i-smoke
cd shit-i-smoke
yarn install

cp app.example.json app.json
# Replaces the API keys placeholders with your own tokens in app.json

yarn start
```

This app is created with Expo, using React Native. When you run `yarn start`, the packager will show, and you can either:

* install the Expo app, scan the displayed QR code, and run the app on your mobile phone directly.
* press `a` to open the Android simulator.
* press `i` to open the iOS simulator.

All the code lives in the `App/` folder. The app itself is pretty small, so it should be fairly easy to navigate through the files.

## Credits

Created with ❤ by [Marcelo](www.marcelocoelho.cc) & [Amaury](https://www.toptal.com/resume/amaury-martiny#utilize-unreal-developers-today).
