# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.8.14](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.13...v1.8.14) (2021-05-17)


### Features

* Add AdSection with AusAir ([#916](https://github.com/amaurymartiny/shoot-i-smoke/issues/916)) ([f40b137](https://github.com/amaurymartiny/shoot-i-smoke/commit/f40b137d788a421ff0fba9e75e464ab619c559f2))

### [1.8.13](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.12...v1.8.13) (2021-03-09)

### [1.8.12](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.11...v1.8.12) (2021-03-06)


### Bug Fixes

* Delete user when no more notifications ([#914](https://github.com/amaurymartiny/shoot-i-smoke/issues/914)) ([d1d34a3](https://github.com/amaurymartiny/shoot-i-smoke/commit/d1d34a30684de344c039076a8549bc4d5eaf2c2e))

### [1.8.11](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.10...v1.8.11) (2021-03-03)


### Bug Fixes

* Fix warnings and errors given by Sentry ([#913](https://github.com/amaurymartiny/shoot-i-smoke/issues/913)) ([d6c4483](https://github.com/amaurymartiny/shoot-i-smoke/commit/d6c4483906f4216f76b217fdfb4cc50599f24d00))

### [1.8.10](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.9...v1.8.10) (2021-03-02)


### Bug Fixes

* Fix setting null/undefined value in AsyncStorage ([#912](https://github.com/amaurymartiny/shoot-i-smoke/issues/912)) ([b39fc67](https://github.com/amaurymartiny/shoot-i-smoke/commit/b39fc67038e3438e263ee04620e6d344d8f537cb))

### [1.8.9](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.8...v1.8.9) (2021-03-02)


### Bug Fixes

* Fix crash on iOS due to AsyncStorage ([#911](https://github.com/amaurymartiny/shoot-i-smoke/issues/911)) ([959c4e7](https://github.com/amaurymartiny/shoot-i-smoke/commit/959c4e7391e41b6be77f55af143c4df6223127e1))

### [1.8.8](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.8.7...v1.8.8) (2021-03-01)


### Bug Fixes

* Fix MapView crashing ([#910](https://github.com/amaurymartiny/shoot-i-smoke/issues/910)) ([12fe7b6](https://github.com/amaurymartiny/shoot-i-smoke/commit/12fe7b61994745c26c27ca70e70d363a53d5b637))

### [1.8.7](https://github.com/shootismoke/mobile-app/compare/v1.8.6...v1.8.7) (2021-03-01)

### [1.8.6](https://github.com/shootismoke/mobile-app/compare/v1.8.5...v1.8.6) (2021-02-28)


### Bug Fixes

* Remove `enableNative` to avoid crash ([a24f36d](https://github.com/shootismoke/mobile-app/commit/a24f36d21d6aee346161134ea69297e2964f1d85))

### [1.8.5](https://github.com/shootismoke/mobile-app/compare/v1.8.4...v1.8.5) (2021-02-28)


### Bug Fixes

* Explicitly use PROVIDER_GOOGLE in MapsView ([7b0e176](https://github.com/shootismoke/mobile-app/commit/7b0e1768e4cd39013404cf8a79a8d53058e17d4c))
* Fix CI, remove duplication, fix Sentry ([#909](https://github.com/shootismoke/mobile-app/issues/909)) ([f5f8ad6](https://github.com/shootismoke/mobile-app/commit/f5f8ad68dde3bcc66fb3e38c554daacd02f4ec3d))
* Only fetch pm25 in openaq race API ([7da9561](https://github.com/shootismoke/mobile-app/commit/7da9561029be750d15affcd44b19e98215a50135))

### [1.8.4](https://github.com/shootismoke/mobile-app/compare/v1.8.3...v1.8.4) (2021-02-28)


### Bug Fixes

* Update @shootismoke/ui to use lastest OpenAQ API v2 ([#907](https://github.com/shootismoke/mobile-app/issues/907)) ([eac4261](https://github.com/shootismoke/mobile-app/commit/eac4261d617f319e0e623f5632f6215b0c47afa9))

### [1.8.3](https://github.com/shootismoke/mobile-app/compare/v1.8.2...v1.8.3) (2021-02-27)

### [1.8.2](https://github.com/shootismoke/mobile-app/compare/v1.8.1...v1.8.2) (2021-02-27)

### [1.8.1](https://github.com/shootismoke/mobile-app/compare/v1.8.0...v1.8.1) (2021-02-27)

## [1.8.0](https://github.com/shootismoke/mobile-app/compare/v1.7.2...v1.8.0) (2021-02-27)


### Features

* Add new expo-status-bar package and added the StatusBar in Screen.tsx ([#751](https://github.com/shootismoke/mobile-app/issues/751)) ([5b34bbf](https://github.com/shootismoke/mobile-app/commit/5b34bbf615e6b9783cefd389fa7ae0560407817f))
* Calculating Max Cigarattes to display dynamically ([#750](https://github.com/shootismoke/mobile-app/issues/750)) ([2d7fb34](https://github.com/shootismoke/mobile-app/commit/2d7fb343628a351cb121232113c20da31afd4700))
* Switch to new backend, remove graphql ([#903](https://github.com/shootismoke/mobile-app/issues/903)) ([1f10db3](https://github.com/shootismoke/mobile-app/commit/1f10db3db85baaac2c429968407514351c6d0f24))
* Update to Expo SDK 40 ([#900](https://github.com/shootismoke/mobile-app/issues/900)) ([5c0ef58](https://github.com/shootismoke/mobile-app/commit/5c0ef58363bf963016186acbbc8d98e23ab82556))
* Use last known location if GPS fails to sync ([#752](https://github.com/shootismoke/mobile-app/issues/752)) ([f0a1716](https://github.com/shootismoke/mobile-app/commit/f0a1716b32bfac4b295f6f407f211f6aba8e371d))


### Bug Fixes

* Fix yarn test:unit v1.22.4 ([#753](https://github.com/shootismoke/mobile-app/issues/753)) ([1b7e89e](https://github.com/shootismoke/mobile-app/commit/1b7e89eddbaadef61df7a9259fe312958c009146)), closes [#724](https://github.com/shootismoke/mobile-app/issues/724)
* Update to Expo SDK 39 ([#747](https://github.com/shootismoke/mobile-app/issues/747)) ([1dc9dfb](https://github.com/shootismoke/mobile-app/commit/1dc9dfb8daaf97ee26fc6d494bbc57a1352fecbc))
* Update to Expo SDK 40 ([#850](https://github.com/shootismoke/mobile-app/issues/850)) ([3ba4052](https://github.com/shootismoke/mobile-app/commit/3ba4052ffa747af50800a89bf9fd49d318febb97))

### [1.7.2](https://github.com/shootismoke/mobile-app/compare/v1.7.1...v1.7.2) (2020-09-14)


### Bug Fixes

* Show rounded number in Details ([#731](https://github.com/shootismoke/mobile-app/issues/731)) ([0b6f367](https://github.com/shootismoke/mobile-app/commit/0b6f36797f839cb6f24b5143479b2bc79af72299))

### [1.7.1](https://github.com/shootismoke/mobile-app/compare/v1.7.0...v1.7.1) (2020-09-11)


### Bug Fixes

* Fix Details page and too many pollutants ([#725](https://github.com/shootismoke/mobile-app/issues/725)) ([cd9520e](https://github.com/shootismoke/mobile-app/commit/cd9520e7458a38cc5dbfb76a48fab88614246d97))

## [1.7.0](https://github.com/shootismoke/mobile-app/compare/v1.6.9...v1.7.0) (2020-09-11)

### [1.6.9](https://github.com/shootismoke/mobile-app/compare/v1.6.8...v1.6.9) (2020-08-15)


### Bug Fixes

* Add timeout to cough...cough... ([#703](https://github.com/shootismoke/mobile-app/issues/703)) ([c591a05](https://github.com/shootismoke/mobile-app/commit/c591a059fb8513096ac58e0d125e584766be2a94))
* Bump expo to SDK38 ([#660](https://github.com/shootismoke/mobile-app/issues/660)) ([be9bec4](https://github.com/shootismoke/mobile-app/commit/be9bec4e0eda889df12188714dece590ec60836b))

### [1.6.8](https://github.com/shootismoke/mobile-app/compare/v1.6.7...v1.6.8) (2020-04-28)


### Bug Fixes

* Fix using staging URL in prod ([#570](https://github.com/shootismoke/mobile-app/issues/570)) ([d5c4037](https://github.com/shootismoke/mobile-app/commit/d5c403797516a6385cf0b7c730959f61cfff7025))

### [1.6.7](https://github.com/shootismoke/mobile-app/compare/v1.6.6...v1.6.7) (2020-04-28)


### Bug Fixes

* Fix production build ([#569](https://github.com/shootismoke/mobile-app/issues/569)) ([1c3a40f](https://github.com/shootismoke/mobile-app/commit/1c3a40f709a650674d7c8dbe187ce28b834daf5a))

### [1.6.6](https://github.com/shootismoke/mobile-app/compare/v1.6.5...v1.6.6) (2020-04-28)


### Bug Fixes

* Use our own FCM credentials ([#568](https://github.com/shootismoke/mobile-app/issues/568)) ([f8a6d3b](https://github.com/shootismoke/mobile-app/commit/f8a6d3b6fe31b9a78d849c00e12031d46e4fcd2b))
* **deps:** Bump expo to 37.0.8 ([#567](https://github.com/shootismoke/mobile-app/issues/567)) ([069977c](https://github.com/shootismoke/mobile-app/commit/069977c41711c0c5b387e1e78201802827b7f629))

### [1.6.5](https://github.com/shootismoke/mobile-app/compare/v1.6.4...v1.6.5) (2020-04-24)


### Bug Fixes

* Remove Apollo warning about cache ([#558](https://github.com/shootismoke/mobile-app/issues/558)) ([f42d3a0](https://github.com/shootismoke/mobile-app/commit/f42d3a0dc2ceb604fe8fd9cd8329dc2abc1fed2a))

### [1.6.4](https://github.com/shootismoke/mobile-app/compare/v1.6.3...v1.6.4) (2020-04-20)


### Bug Fixes

* Fix production.yml not running on CI ([#557](https://github.com/shootismoke/mobile-app/issues/557)) ([6ef1814](https://github.com/shootismoke/mobile-app/commit/6ef18143a5f0307355d3d85c81029510af143159))

### [1.6.3](https://github.com/shootismoke/mobile-app/compare/v1.6.2...v1.6.3) (2020-04-20)


### Bug Fixes

* Improve translations slightly ([#556](https://github.com/shootismoke/mobile-app/issues/556)) ([d689d33](https://github.com/shootismoke/mobile-app/commit/d689d33833fc98039ed6f4595c8bf6e48209371f))
* **deps:** Update Expo to 37.0.7 ([#548](https://github.com/shootismoke/mobile-app/issues/548)) ([d769a5d](https://github.com/shootismoke/mobile-app/commit/d769a5d75900ab3ce4ac9bcfc68508671862095f))

### [1.6.2](https://github.com/shootismoke/mobile-app/compare/v1.6.1...v1.6.2) (2020-04-09)

### [1.6.1](https://github.com/shootismoke/mobile-app/compare/v1.6.0...v1.6.1) (2020-04-06)


### Bug Fixes

* Add back `headerVisible: false` ([#535](https://github.com/shootismoke/mobile-app/issues/535)) ([e38bb0d](https://github.com/shootismoke/mobile-app/commit/e38bb0d1623aa5338394a2338c75608f81953bed))
* Add back headerVisible: false ([#534](https://github.com/shootismoke/mobile-app/issues/534)) ([45afc46](https://github.com/shootismoke/mobile-app/commit/45afc46029bc909830e5f27344be0ba49bdba51c))

## [1.6.0](https://github.com/shootismoke/mobile-app/compare/v1.5.7...v1.6.0) (2020-04-06)


### Bug Fixes

* **deps:** Update to Expo SDK37 ([#532](https://github.com/shootismoke/mobile-app/issues/532)) ([eb51486](https://github.com/shootismoke/mobile-app/commit/eb51486bdbdf4db6342fe8163c3253ca0e97fb04))

### [1.5.7](https://github.com/shootismoke/mobile-app/compare/v1.5.6...v1.5.7) (2020-03-21)


### Bug Fixes

* Fix `t.response.data` undefined error ([#506](https://github.com/shootismoke/mobile-app/issues/506)) ([dd98291](https://github.com/shootismoke/mobile-app/commit/dd9829103974ce0e1288420b467f92648a619be8))
* Fix production github actions ([#505](https://github.com/shootismoke/mobile-app/issues/505)) ([b44fa30](https://github.com/shootismoke/mobile-app/commit/b44fa30a223495358fc2f269ecdc0c40eda8820b))

### [1.5.6](https://github.com/shootismoke/mobile-app/compare/v1.5.5...v1.5.6) (2020-03-21)


### Bug Fixes

* Add detailed amplitude tracking for notifications ([#501](https://github.com/shootismoke/mobile-app/issues/501)) ([4e67d06](https://github.com/shootismoke/mobile-app/commit/4e67d064955496575cefe2c04cd78fc62fa1f442))
* Add OpenAQ as credits in About page ([#502](https://github.com/shootismoke/mobile-app/issues/502)) ([c80b6cc](https://github.com/shootismoke/mobile-app/commit/c80b6cc74b43c433636d36c0903747661b1d0867))
* Fix translation typo ([#503](https://github.com/shootismoke/mobile-app/issues/503)) ([9ae0c5d](https://github.com/shootismoke/mobile-app/commit/9ae0c5df2ce686062b46a4088a93db02512c91d6))
* Remove duplicate in github action yaml ([#498](https://github.com/shootismoke/mobile-app/issues/498)) ([620bf0d](https://github.com/shootismoke/mobile-app/commit/620bf0d1605b91168782742970d2d0414cda3f5a))
* Typo in Github action branch name ([#500](https://github.com/shootismoke/mobile-app/issues/500)) ([2456bf9](https://github.com/shootismoke/mobile-app/commit/2456bf9f4063daf8e9225ac2b1a3de6b6de7c94c))

### [1.5.5](https://github.com/shootismoke/mobile-app/compare/v1.5.4...v1.5.5) (2020-03-21)


### Bug Fixes

* Add name and client to ApolloClient ([#494](https://github.com/shootismoke/mobile-app/issues/494)) ([eaaa75c](https://github.com/shootismoke/mobile-app/commit/eaaa75c1dbed0141bfc26efd6202bcae9c994747))

### [1.5.4](https://github.com/shootismoke/mobile-app/compare/v1.5.3...v1.5.4) (2020-03-20)


### Bug Fixes

* Fix github actions expo build command ([#491](https://github.com/shootismoke/mobile-app/issues/491)) ([255f328](https://github.com/shootismoke/mobile-app/commit/255f32888624bd42af3460937f7f7e27cf61b43b))
* Handle hawk stale timestamp error from backend ([#492](https://github.com/shootismoke/mobile-app/issues/492)) ([5796fd0](https://github.com/shootismoke/mobile-app/commit/5796fd05182e68082b413a05abdb85e9d6e9a6c2))

### [1.5.3](https://github.com/shootismoke/mobile-app/compare/v1.5.2...v1.5.3) (2020-03-19)

### [1.5.2](https://github.com/shootismoke/mobile-app/compare/v1.5.1...v1.5.2) (2020-03-17)


### Bug Fixes

* Only create new user when getUser query finishes loading ([#488](https://github.com/shootismoke/mobile-app/issues/488)) ([8dfb96e](https://github.com/shootismoke/mobile-app/commit/8dfb96ed54e34f7c7bca6f4a5e186556052d33a0))
* Use Maybe<User> for getUser endpoint ([#487](https://github.com/shootismoke/mobile-app/issues/487)) ([8c247ac](https://github.com/shootismoke/mobile-app/commit/8c247ac01d4caf36c0488de3df5c6648c06eb0f5))

### [1.5.1](https://github.com/shootismoke/mobile-app/compare/v1.5.0...v1.5.1) (2020-03-14)


### Bug Fixes

* Remove useless Algolia community keys ([#480](https://github.com/shootismoke/mobile-app/issues/480)) ([f45d774](https://github.com/shootismoke/mobile-app/commit/f45d7743c3578ae3d4f60a8fb8ef8ced8c5373c1))

## [1.5.0](https://github.com/shootismoke/mobile-app/compare/v1.4.0...v1.5.0) (2020-03-13)


### Features

* Add chinese(traditional) language ([#318](https://github.com/shootismoke/mobile-app/issues/318)) ([#319](https://github.com/shootismoke/mobile-app/issues/319)) ([f497e60](https://github.com/shootismoke/mobile-app/commit/f497e60ec64416205e36964ed0a87b9dd89f0bf5))
* Add Korean translation ([#324](https://github.com/shootismoke/mobile-app/issues/324)) ([47341f7](https://github.com/shootismoke/mobile-app/commit/47341f7d1dbd2e38cd898c8a75b6c414bb154066))
* Add notifications UI ([#439](https://github.com/shootismoke/mobile-app/issues/439)) ([fc9bffc](https://github.com/shootismoke/mobile-app/commit/fc9bffc46de2aa3fcf7871dd3f28819d24745805))
* Add Offix to handle offline-first apollo ([#454](https://github.com/shootismoke/mobile-app/issues/454)) ([32387f5](https://github.com/shootismoke/mobile-app/commit/32387f5c41f110ca5212ed92832350daace87210))
* Add russian language ([#279](https://github.com/shootismoke/mobile-app/issues/279)) ([5812c71](https://github.com/shootismoke/mobile-app/commit/5812c7149949fd7916182951abdbaa59d780d567))
* Add SelectNotifications component to choose notifications ([#328](https://github.com/shootismoke/mobile-app/issues/328)) ([2fb831d](https://github.com/shootismoke/mobile-app/commit/2fb831dc0aefd91b0921246148c0ee7fb8173d2b))
* Add swedish language ([#293](https://github.com/shootismoke/mobile-app/issues/293)) ([3e044ec](https://github.com/shootismoke/mobile-app/commit/3e044ece0c129859b7e462064651fb7209c1a529))
* Add Ukrainian language ([#277](https://github.com/shootismoke/mobile-app/issues/277)) ([84eeccc](https://github.com/shootismoke/mobile-app/commit/84eeccc53049f71e761acb73003b9315a2dc9a6a))
* Authenticate all backend calls with Hawk ([#411](https://github.com/shootismoke/mobile-app/issues/411)) ([890709f](https://github.com/shootismoke/mobile-app/commit/890709f7e1d4e33f960fa128537689f55556eb51))
* Expand share dialog on iOS ([#250](https://github.com/shootismoke/mobile-app/issues/250)) ([#278](https://github.com/shootismoke/mobile-app/issues/278)) ([0a37241](https://github.com/shootismoke/mobile-app/commit/0a3724121aa4e4b5b7120e3e003fc45baff829cd))
* Fetch historical data from OpenAQ ([#425](https://github.com/shootismoke/mobile-app/issues/425)) ([26acad1](https://github.com/shootismoke/mobile-app/commit/26acad1e775eb7c603d54eaf1e59daa5fdfa1d93))
* First release for italian locale ([#272](https://github.com/shootismoke/mobile-app/issues/272)) ([f8814a1](https://github.com/shootismoke/mobile-app/commit/f8814a11179d9ae1f8a603523b08fbdd338cd20c))
* Implement miles/kilometer selector ([#252](https://github.com/shootismoke/mobile-app/issues/252)) ([ca91f5b](https://github.com/shootismoke/mobile-app/commit/ca91f5bd04601324d1bfc132e14ee49b39eeb352))
* Replace share text with an image on iOS ([#242](https://github.com/shootismoke/mobile-app/issues/242)) ([3250390](https://github.com/shootismoke/mobile-app/commit/32503905773de6bf6ac8a664be935a6b7e97f20c))
* Share android image via expo-sharing ([#247](https://github.com/shootismoke/mobile-app/issues/247)) ([#255](https://github.com/shootismoke/mobile-app/issues/255)) ([9641cf6](https://github.com/shootismoke/mobile-app/commit/9641cf6437f9043fd95295a67f8ebcb77687fdc0))
* Translation to french ([#267](https://github.com/shootismoke/mobile-app/issues/267)) ([56c763a](https://github.com/shootismoke/mobile-app/commit/56c763a700c675ca8374778a9dfe937cb60807ff))


### Bug Fixes

* ActionPicker should take Switch + text ([#459](https://github.com/shootismoke/mobile-app/issues/459)) ([90e63a4](https://github.com/shootismoke/mobile-app/commit/90e63a478ebafc7774c76a5116bc71c078845c1f))
* Add image in push notification ([#460](https://github.com/shootismoke/mobile-app/issues/460)) ([f45a777](https://github.com/shootismoke/mobile-app/commit/f45a777f77d618149f757e281ff1021dd49831a1))
* Add revisionId to Amplitude ([#273](https://github.com/shootismoke/mobile-app/issues/273)) ([2536b6b](https://github.com/shootismoke/mobile-app/commit/2536b6b67909462b41304a28d99e292173039651))
* Add sentry logs on errors ([#269](https://github.com/shootismoke/mobile-app/issues/269)) ([f0f5f23](https://github.com/shootismoke/mobile-app/commit/f0f5f2370505d5096bc174662a17b4802a800ffc))
* Add typechecking on yarn lint ([#248](https://github.com/shootismoke/mobile-app/issues/248)) ([#251](https://github.com/shootismoke/mobile-app/issues/251)) ([33b6ca9](https://github.com/shootismoke/mobile-app/commit/33b6ca9d107d8e71437cb650eb1b5d6df544ee79))
* Added Finished Spanish Translation ([#303](https://github.com/shootismoke/mobile-app/issues/303)) ([8fd0b43](https://github.com/shootismoke/mobile-app/commit/8fd0b4318f8e94f2fbe8bc54e9d109b7c70eb2d5))
* Don't track location errors on Sentry ([#326](https://github.com/shootismoke/mobile-app/issues/326)) ([c416d0f](https://github.com/shootismoke/mobile-app/commit/c416d0f3e331a601cf88b13c078c7246c1b6b773))
* Fix android statusbar translucency ([#374](https://github.com/shootismoke/mobile-app/issues/374)) ([79f3345](https://github.com/shootismoke/mobile-app/commit/79f3345c88f05ce9969bd74d7186ed66437ba7e7)), closes [#250](https://github.com/shootismoke/mobile-app/issues/250)
* Force status bar style to be dark content in iOS ([#305](https://github.com/shootismoke/mobile-app/issues/305)) ([16ef296](https://github.com/shootismoke/mobile-app/commit/16ef296719f91376d7f9d1d5770e6f78e88dbbe1))
* More permissive error matching to skip sentry ([#414](https://github.com/shootismoke/mobile-app/issues/414)) ([f958293](https://github.com/shootismoke/mobile-app/commit/f9582939d676d60796e2f165e09e07175714746f))
* Remove alpha notifications from About ([#395](https://github.com/shootismoke/mobile-app/issues/395)) ([32edba5](https://github.com/shootismoke/mobile-app/commit/32edba53793da07ee3cf9bfffcb8519cf991c31d))
* Remove fetching from openaq for historical data ([#453](https://github.com/shootismoke/mobile-app/issues/453)) ([80a1ab4](https://github.com/shootismoke/mobile-app/commit/80a1ab4037d1ca1f897f94e7a2bf31d18dc1223f))
* Remove warning for wrong view-shot version ([#412](https://github.com/shootismoke/mobile-app/issues/412)) ([2404dcc](https://github.com/shootismoke/mobile-app/commit/2404dcce7d03d38c0298fed42b30219f762bae31))
* Retry fetching expo push token ([#473](https://github.com/shootismoke/mobile-app/issues/473)) ([c6392fd](https://github.com/shootismoke/mobile-app/commit/c6392fdc96e451ad076bbac971ebdedeac849156))
* Round the cigarettes number when shared ([#241](https://github.com/shootismoke/mobile-app/issues/241)) ([5da7196](https://github.com/shootismoke/mobile-app/commit/5da71960289c5faa0ddf13d2df76b511d337e3ab))
* Show isToofar warning on monthly and weekly ([#426](https://github.com/shootismoke/mobile-app/issues/426)) ([8f4569a](https://github.com/shootismoke/mobile-app/commit/8f4569a99503323ede87c4d44f94e98c051e4dd1))
* Show revision ID nicely ([#271](https://github.com/shootismoke/mobile-app/issues/271)) ([4a9b38e](https://github.com/shootismoke/mobile-app/commit/4a9b38eb5f1a5a8151fb9c0a30a092cf43472672))
* Update kr.json ([#331](https://github.com/shootismoke/mobile-app/issues/331)) ([b3fb855](https://github.com/shootismoke/mobile-app/commit/b3fb855460d2b9068b0cfbe45ed1cc0c12b28cd3))
* Use universalId for updating notifications ([#451](https://github.com/shootismoke/mobile-app/issues/451)) ([e7c67a8](https://github.com/shootismoke/mobile-app/commit/e7c67a86c1855ace2e6bbfbe856a40d98ffebdb0))

# [1.4.0](https://github.com/shootismoke/mobile-app/compare/v1.3.1...v1.4.0) (2019-10-02)


### Bug Fixes

* Add missing translations ([#81](https://github.com/shootismoke/mobile-app/issues/81)) ([7a74f01](https://github.com/shootismoke/mobile-app/commit/7a74f01))
* Don't show 0 more days ([#163](https://github.com/shootismoke/mobile-app/issues/163)) ([1303bae](https://github.com/shootismoke/mobile-app/commit/1303bae))
* Fix bugs with "Not saving" on startup and no reverse location name ([#164](https://github.com/shootismoke/mobile-app/issues/164)) ([5ae06ef](https://github.com/shootismoke/mobile-app/commit/5ae06ef))
* Fix shadow consistency ios/android ([#140](https://github.com/shootismoke/mobile-app/issues/140)) ([22604e4](https://github.com/shootismoke/mobile-app/commit/22604e4))
* Make background fetch work ([#167](https://github.com/shootismoke/mobile-app/issues/167)) ([36e2607](https://github.com/shootismoke/mobile-app/commit/36e2607))
* Make location icon center aligned ([#233](https://github.com/shootismoke/mobile-app/issues/233)) ([99cd5d3](https://github.com/shootismoke/mobile-app/commit/99cd5d3))
* Make reverse geocode and fetchApi work correctly ([#136](https://github.com/shootismoke/mobile-app/issues/136)) ([8050d31](https://github.com/shootismoke/mobile-app/commit/8050d31))
* Make text fit on 1st line ([#218](https://github.com/shootismoke/mobile-app/issues/218)) ([c31d92a](https://github.com/shootismoke/mobile-app/commit/c31d92a))
* No console.warn when amplitude key undefined ([#217](https://github.com/shootismoke/mobile-app/issues/217)) ([aa65a31](https://github.com/shootismoke/mobile-app/commit/aa65a31))
* removes undefined style ([#87](https://github.com/shootismoke/mobile-app/issues/87)) ([3a67e1e](https://github.com/shootismoke/mobile-app/commit/3a67e1e))
* Replaced the change location image ([#232](https://github.com/shootismoke/mobile-app/issues/232)) ([0028b67](https://github.com/shootismoke/mobile-app/commit/0028b67))
* Small tweaks, including fix ErrorScreen ([#142](https://github.com/shootismoke/mobile-app/issues/142)) ([658a6fa](https://github.com/shootismoke/mobile-app/commit/658a6fa))
* Use en-US for US locales, en otherwise ([#166](https://github.com/shootismoke/mobile-app/issues/166)) ([4c83ed3](https://github.com/shootismoke/mobile-app/commit/4c83ed3))


### Features

* Add Amplitude analytics ([#204](https://github.com/shootismoke/mobile-app/issues/204)) ([40dbc38](https://github.com/shootismoke/mobile-app/commit/40dbc38))
* Add BETA tag on weekly/monthly cigarettes ([#234](https://github.com/shootismoke/mobile-app/issues/234)) ([5a6d9b5](https://github.com/shootismoke/mobile-app/commit/5a6d9b5))
* Add button to change language ([#85](https://github.com/shootismoke/mobile-app/issues/85)) ([4060f7e](https://github.com/shootismoke/mobile-app/commit/4060f7e))
* Add history of cigarettes ([#121](https://github.com/shootismoke/mobile-app/issues/121)) ([8e8f836](https://github.com/shootismoke/mobile-app/commit/8e8f836))
* Add list of stations that monitored user's AQI ([#131](https://github.com/shootismoke/mobile-app/issues/131)) ([96aec9a](https://github.com/shootismoke/mobile-app/commit/96aec9a))
* Add scrolling to relevant section in About ([#145](https://github.com/shootismoke/mobile-app/issues/145)) ([8dc4f65](https://github.com/shootismoke/mobile-app/commit/8dc4f65))
* Add UX for weekly and monthly on homepage ([#127](https://github.com/shootismoke/mobile-app/issues/127)) ([b57c477](https://github.com/shootismoke/mobile-app/commit/b57c477))
* Calculate integral of rawPm25 in history ([#143](https://github.com/shootismoke/mobile-app/issues/143)) ([99faf04](https://github.com/shootismoke/mobile-app/commit/99faf04))
* Distance is measured in mi for en ([#153](https://github.com/shootismoke/mobile-app/issues/153)) ([13c08b5](https://github.com/shootismoke/mobile-app/commit/13c08b5))
* Remove tracking GPS and AQI history ([#202](https://github.com/shootismoke/mobile-app/issues/202)) ([90b0393](https://github.com/shootismoke/mobile-app/commit/90b0393))
* Spanish Translations added ([#83](https://github.com/shootismoke/mobile-app/issues/83)) ([84cbf1c](https://github.com/shootismoke/mobile-app/commit/84cbf1c))
* Store history data each hour ([#109](https://github.com/shootismoke/mobile-app/issues/109)) ([079ab7c](https://github.com/shootismoke/mobile-app/commit/079ab7c)), closes [#72](https://github.com/shootismoke/mobile-app/issues/72) [#77](https://github.com/shootismoke/mobile-app/issues/77) [#79](https://github.com/shootismoke/mobile-app/issues/79) [#81](https://github.com/shootismoke/mobile-app/issues/81) [#83](https://github.com/shootismoke/mobile-app/issues/83) [#84](https://github.com/shootismoke/mobile-app/issues/84) [#85](https://github.com/shootismoke/mobile-app/issues/85) [#87](https://github.com/shootismoke/mobile-app/issues/87) [#88](https://github.com/shootismoke/mobile-app/issues/88) [#90](https://github.com/shootismoke/mobile-app/issues/90) [#91](https://github.com/shootismoke/mobile-app/issues/91) [#92](https://github.com/shootismoke/mobile-app/issues/92) [#95](https://github.com/shootismoke/mobile-app/issues/95) [#94](https://github.com/shootismoke/mobile-app/issues/94)
* Track app focus and exit ([#219](https://github.com/shootismoke/mobile-app/issues/219)) ([72079c7](https://github.com/shootismoke/mobile-app/commit/72079c7))



## [1.3.1](https://github.com/shootismoke/mobile-app/compare/v1.3.0...v1.3.1) (2019-04-17)


### Bug Fixes

* Possible dark video background issue fix ([#70](https://github.com/shootismoke/mobile-app/issues/70)) ([d948b36](https://github.com/shootismoke/mobile-app/commit/d948b36))
* Use video with white background ([#65](https://github.com/shootismoke/mobile-app/issues/65)) ([a84263e](https://github.com/shootismoke/mobile-app/commit/a84263e))
* video black screen ([#64](https://github.com/shootismoke/mobile-app/issues/64)) ([1aac378](https://github.com/shootismoke/mobile-app/commit/1aac378))



# [1.3.0](https://github.com/shootismoke/mobile-app/compare/v1.2.1...v1.3.0) (2019-03-22)


### Features

* add clearer error messages ([#61](https://github.com/shootismoke/mobile-app/issues/61)) ([70fbe70](https://github.com/shootismoke/mobile-app/commit/70fbe70))
