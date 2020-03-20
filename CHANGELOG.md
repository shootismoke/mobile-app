# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.5.4](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.5.3...v1.5.4) (2020-03-20)


### Bug Fixes

* Fix github actions expo build command ([#491](https://github.com/amaurymartiny/shoot-i-smoke/issues/491)) ([255f328](https://github.com/amaurymartiny/shoot-i-smoke/commit/255f32888624bd42af3460937f7f7e27cf61b43b))
* Handle hawk stale timestamp error from backend ([#492](https://github.com/amaurymartiny/shoot-i-smoke/issues/492)) ([5796fd0](https://github.com/amaurymartiny/shoot-i-smoke/commit/5796fd05182e68082b413a05abdb85e9d6e9a6c2))

### [1.5.3](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.5.2...v1.5.3) (2020-03-19)

### [1.5.2](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.5.1...v1.5.2) (2020-03-17)


### Bug Fixes

* Only create new user when getUser query finishes loading ([#488](https://github.com/amaurymartiny/shoot-i-smoke/issues/488)) ([8dfb96e](https://github.com/amaurymartiny/shoot-i-smoke/commit/8dfb96ed54e34f7c7bca6f4a5e186556052d33a0))
* Use Maybe<User> for getUser endpoint ([#487](https://github.com/amaurymartiny/shoot-i-smoke/issues/487)) ([8c247ac](https://github.com/amaurymartiny/shoot-i-smoke/commit/8c247ac01d4caf36c0488de3df5c6648c06eb0f5))

### [1.5.1](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.5.0...v1.5.1) (2020-03-14)


### Bug Fixes

* Remove useless Algolia community keys ([#480](https://github.com/amaurymartiny/shoot-i-smoke/issues/480)) ([f45d774](https://github.com/amaurymartiny/shoot-i-smoke/commit/f45d7743c3578ae3d4f60a8fb8ef8ced8c5373c1))

## [1.5.0](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.4.0...v1.5.0) (2020-03-13)


### Features

* Add chinese(traditional) language ([#318](https://github.com/amaurymartiny/shoot-i-smoke/issues/318)) ([#319](https://github.com/amaurymartiny/shoot-i-smoke/issues/319)) ([f497e60](https://github.com/amaurymartiny/shoot-i-smoke/commit/f497e60ec64416205e36964ed0a87b9dd89f0bf5))
* Add Korean translation ([#324](https://github.com/amaurymartiny/shoot-i-smoke/issues/324)) ([47341f7](https://github.com/amaurymartiny/shoot-i-smoke/commit/47341f7d1dbd2e38cd898c8a75b6c414bb154066))
* Add notifications UI ([#439](https://github.com/amaurymartiny/shoot-i-smoke/issues/439)) ([fc9bffc](https://github.com/amaurymartiny/shoot-i-smoke/commit/fc9bffc46de2aa3fcf7871dd3f28819d24745805))
* Add Offix to handle offline-first apollo ([#454](https://github.com/amaurymartiny/shoot-i-smoke/issues/454)) ([32387f5](https://github.com/amaurymartiny/shoot-i-smoke/commit/32387f5c41f110ca5212ed92832350daace87210))
* Add russian language ([#279](https://github.com/amaurymartiny/shoot-i-smoke/issues/279)) ([5812c71](https://github.com/amaurymartiny/shoot-i-smoke/commit/5812c7149949fd7916182951abdbaa59d780d567))
* Add SelectNotifications component to choose notifications ([#328](https://github.com/amaurymartiny/shoot-i-smoke/issues/328)) ([2fb831d](https://github.com/amaurymartiny/shoot-i-smoke/commit/2fb831dc0aefd91b0921246148c0ee7fb8173d2b))
* Add swedish language ([#293](https://github.com/amaurymartiny/shoot-i-smoke/issues/293)) ([3e044ec](https://github.com/amaurymartiny/shoot-i-smoke/commit/3e044ece0c129859b7e462064651fb7209c1a529))
* Add Ukrainian language ([#277](https://github.com/amaurymartiny/shoot-i-smoke/issues/277)) ([84eeccc](https://github.com/amaurymartiny/shoot-i-smoke/commit/84eeccc53049f71e761acb73003b9315a2dc9a6a))
* Authenticate all backend calls with Hawk ([#411](https://github.com/amaurymartiny/shoot-i-smoke/issues/411)) ([890709f](https://github.com/amaurymartiny/shoot-i-smoke/commit/890709f7e1d4e33f960fa128537689f55556eb51))
* Expand share dialog on iOS ([#250](https://github.com/amaurymartiny/shoot-i-smoke/issues/250)) ([#278](https://github.com/amaurymartiny/shoot-i-smoke/issues/278)) ([0a37241](https://github.com/amaurymartiny/shoot-i-smoke/commit/0a3724121aa4e4b5b7120e3e003fc45baff829cd))
* Fetch historical data from OpenAQ ([#425](https://github.com/amaurymartiny/shoot-i-smoke/issues/425)) ([26acad1](https://github.com/amaurymartiny/shoot-i-smoke/commit/26acad1e775eb7c603d54eaf1e59daa5fdfa1d93))
* First release for italian locale ([#272](https://github.com/amaurymartiny/shoot-i-smoke/issues/272)) ([f8814a1](https://github.com/amaurymartiny/shoot-i-smoke/commit/f8814a11179d9ae1f8a603523b08fbdd338cd20c))
* Implement miles/kilometer selector ([#252](https://github.com/amaurymartiny/shoot-i-smoke/issues/252)) ([ca91f5b](https://github.com/amaurymartiny/shoot-i-smoke/commit/ca91f5bd04601324d1bfc132e14ee49b39eeb352))
* Replace share text with an image on iOS ([#242](https://github.com/amaurymartiny/shoot-i-smoke/issues/242)) ([3250390](https://github.com/amaurymartiny/shoot-i-smoke/commit/32503905773de6bf6ac8a664be935a6b7e97f20c))
* Share android image via expo-sharing ([#247](https://github.com/amaurymartiny/shoot-i-smoke/issues/247)) ([#255](https://github.com/amaurymartiny/shoot-i-smoke/issues/255)) ([9641cf6](https://github.com/amaurymartiny/shoot-i-smoke/commit/9641cf6437f9043fd95295a67f8ebcb77687fdc0))
* Translation to french ([#267](https://github.com/amaurymartiny/shoot-i-smoke/issues/267)) ([56c763a](https://github.com/amaurymartiny/shoot-i-smoke/commit/56c763a700c675ca8374778a9dfe937cb60807ff))


### Bug Fixes

* ActionPicker should take Switch + text ([#459](https://github.com/amaurymartiny/shoot-i-smoke/issues/459)) ([90e63a4](https://github.com/amaurymartiny/shoot-i-smoke/commit/90e63a478ebafc7774c76a5116bc71c078845c1f))
* Add image in push notification ([#460](https://github.com/amaurymartiny/shoot-i-smoke/issues/460)) ([f45a777](https://github.com/amaurymartiny/shoot-i-smoke/commit/f45a777f77d618149f757e281ff1021dd49831a1))
* Add revisionId to Amplitude ([#273](https://github.com/amaurymartiny/shoot-i-smoke/issues/273)) ([2536b6b](https://github.com/amaurymartiny/shoot-i-smoke/commit/2536b6b67909462b41304a28d99e292173039651))
* Add sentry logs on errors ([#269](https://github.com/amaurymartiny/shoot-i-smoke/issues/269)) ([f0f5f23](https://github.com/amaurymartiny/shoot-i-smoke/commit/f0f5f2370505d5096bc174662a17b4802a800ffc))
* Add typechecking on yarn lint ([#248](https://github.com/amaurymartiny/shoot-i-smoke/issues/248)) ([#251](https://github.com/amaurymartiny/shoot-i-smoke/issues/251)) ([33b6ca9](https://github.com/amaurymartiny/shoot-i-smoke/commit/33b6ca9d107d8e71437cb650eb1b5d6df544ee79))
* Added Finished Spanish Translation ([#303](https://github.com/amaurymartiny/shoot-i-smoke/issues/303)) ([8fd0b43](https://github.com/amaurymartiny/shoot-i-smoke/commit/8fd0b4318f8e94f2fbe8bc54e9d109b7c70eb2d5))
* Don't track location errors on Sentry ([#326](https://github.com/amaurymartiny/shoot-i-smoke/issues/326)) ([c416d0f](https://github.com/amaurymartiny/shoot-i-smoke/commit/c416d0f3e331a601cf88b13c078c7246c1b6b773))
* Fix android statusbar translucency ([#374](https://github.com/amaurymartiny/shoot-i-smoke/issues/374)) ([79f3345](https://github.com/amaurymartiny/shoot-i-smoke/commit/79f3345c88f05ce9969bd74d7186ed66437ba7e7)), closes [#250](https://github.com/amaurymartiny/shoot-i-smoke/issues/250)
* Force status bar style to be dark content in iOS ([#305](https://github.com/amaurymartiny/shoot-i-smoke/issues/305)) ([16ef296](https://github.com/amaurymartiny/shoot-i-smoke/commit/16ef296719f91376d7f9d1d5770e6f78e88dbbe1))
* More permissive error matching to skip sentry ([#414](https://github.com/amaurymartiny/shoot-i-smoke/issues/414)) ([f958293](https://github.com/amaurymartiny/shoot-i-smoke/commit/f9582939d676d60796e2f165e09e07175714746f))
* Remove alpha notifications from About ([#395](https://github.com/amaurymartiny/shoot-i-smoke/issues/395)) ([32edba5](https://github.com/amaurymartiny/shoot-i-smoke/commit/32edba53793da07ee3cf9bfffcb8519cf991c31d))
* Remove fetching from openaq for historical data ([#453](https://github.com/amaurymartiny/shoot-i-smoke/issues/453)) ([80a1ab4](https://github.com/amaurymartiny/shoot-i-smoke/commit/80a1ab4037d1ca1f897f94e7a2bf31d18dc1223f))
* Remove warning for wrong view-shot version ([#412](https://github.com/amaurymartiny/shoot-i-smoke/issues/412)) ([2404dcc](https://github.com/amaurymartiny/shoot-i-smoke/commit/2404dcce7d03d38c0298fed42b30219f762bae31))
* Retry fetching expo push token ([#473](https://github.com/amaurymartiny/shoot-i-smoke/issues/473)) ([c6392fd](https://github.com/amaurymartiny/shoot-i-smoke/commit/c6392fdc96e451ad076bbac971ebdedeac849156))
* Round the cigarettes number when shared ([#241](https://github.com/amaurymartiny/shoot-i-smoke/issues/241)) ([5da7196](https://github.com/amaurymartiny/shoot-i-smoke/commit/5da71960289c5faa0ddf13d2df76b511d337e3ab))
* Show isToofar warning on monthly and weekly ([#426](https://github.com/amaurymartiny/shoot-i-smoke/issues/426)) ([8f4569a](https://github.com/amaurymartiny/shoot-i-smoke/commit/8f4569a99503323ede87c4d44f94e98c051e4dd1))
* Show revision ID nicely ([#271](https://github.com/amaurymartiny/shoot-i-smoke/issues/271)) ([4a9b38e](https://github.com/amaurymartiny/shoot-i-smoke/commit/4a9b38eb5f1a5a8151fb9c0a30a092cf43472672))
* Update kr.json ([#331](https://github.com/amaurymartiny/shoot-i-smoke/issues/331)) ([b3fb855](https://github.com/amaurymartiny/shoot-i-smoke/commit/b3fb855460d2b9068b0cfbe45ed1cc0c12b28cd3))
* Use universalId for updating notifications ([#451](https://github.com/amaurymartiny/shoot-i-smoke/issues/451)) ([e7c67a8](https://github.com/amaurymartiny/shoot-i-smoke/commit/e7c67a86c1855ace2e6bbfbe856a40d98ffebdb0))

# [1.4.0](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.3.1...v1.4.0) (2019-10-02)


### Bug Fixes

* Add missing translations ([#81](https://github.com/amaurymartiny/shoot-i-smoke/issues/81)) ([7a74f01](https://github.com/amaurymartiny/shoot-i-smoke/commit/7a74f01))
* Don't show 0 more days ([#163](https://github.com/amaurymartiny/shoot-i-smoke/issues/163)) ([1303bae](https://github.com/amaurymartiny/shoot-i-smoke/commit/1303bae))
* Fix bugs with "Not saving" on startup and no reverse location name ([#164](https://github.com/amaurymartiny/shoot-i-smoke/issues/164)) ([5ae06ef](https://github.com/amaurymartiny/shoot-i-smoke/commit/5ae06ef))
* Fix shadow consistency ios/android ([#140](https://github.com/amaurymartiny/shoot-i-smoke/issues/140)) ([22604e4](https://github.com/amaurymartiny/shoot-i-smoke/commit/22604e4))
* Make background fetch work ([#167](https://github.com/amaurymartiny/shoot-i-smoke/issues/167)) ([36e2607](https://github.com/amaurymartiny/shoot-i-smoke/commit/36e2607))
* Make location icon center aligned ([#233](https://github.com/amaurymartiny/shoot-i-smoke/issues/233)) ([99cd5d3](https://github.com/amaurymartiny/shoot-i-smoke/commit/99cd5d3))
* Make reverse geocode and fetchApi work correctly ([#136](https://github.com/amaurymartiny/shoot-i-smoke/issues/136)) ([8050d31](https://github.com/amaurymartiny/shoot-i-smoke/commit/8050d31))
* Make text fit on 1st line ([#218](https://github.com/amaurymartiny/shoot-i-smoke/issues/218)) ([c31d92a](https://github.com/amaurymartiny/shoot-i-smoke/commit/c31d92a))
* No console.warn when amplitude key undefined ([#217](https://github.com/amaurymartiny/shoot-i-smoke/issues/217)) ([aa65a31](https://github.com/amaurymartiny/shoot-i-smoke/commit/aa65a31))
* removes undefined style ([#87](https://github.com/amaurymartiny/shoot-i-smoke/issues/87)) ([3a67e1e](https://github.com/amaurymartiny/shoot-i-smoke/commit/3a67e1e))
* Replaced the change location image ([#232](https://github.com/amaurymartiny/shoot-i-smoke/issues/232)) ([0028b67](https://github.com/amaurymartiny/shoot-i-smoke/commit/0028b67))
* Small tweaks, including fix ErrorScreen ([#142](https://github.com/amaurymartiny/shoot-i-smoke/issues/142)) ([658a6fa](https://github.com/amaurymartiny/shoot-i-smoke/commit/658a6fa))
* Use en-US for US locales, en otherwise ([#166](https://github.com/amaurymartiny/shoot-i-smoke/issues/166)) ([4c83ed3](https://github.com/amaurymartiny/shoot-i-smoke/commit/4c83ed3))


### Features

* Add Amplitude analytics ([#204](https://github.com/amaurymartiny/shoot-i-smoke/issues/204)) ([40dbc38](https://github.com/amaurymartiny/shoot-i-smoke/commit/40dbc38))
* Add BETA tag on weekly/monthly cigarettes ([#234](https://github.com/amaurymartiny/shoot-i-smoke/issues/234)) ([5a6d9b5](https://github.com/amaurymartiny/shoot-i-smoke/commit/5a6d9b5))
* Add button to change language ([#85](https://github.com/amaurymartiny/shoot-i-smoke/issues/85)) ([4060f7e](https://github.com/amaurymartiny/shoot-i-smoke/commit/4060f7e))
* Add history of cigarettes ([#121](https://github.com/amaurymartiny/shoot-i-smoke/issues/121)) ([8e8f836](https://github.com/amaurymartiny/shoot-i-smoke/commit/8e8f836))
* Add list of stations that monitored user's AQI ([#131](https://github.com/amaurymartiny/shoot-i-smoke/issues/131)) ([96aec9a](https://github.com/amaurymartiny/shoot-i-smoke/commit/96aec9a))
* Add scrolling to relevant section in About ([#145](https://github.com/amaurymartiny/shoot-i-smoke/issues/145)) ([8dc4f65](https://github.com/amaurymartiny/shoot-i-smoke/commit/8dc4f65))
* Add UX for weekly and monthly on homepage ([#127](https://github.com/amaurymartiny/shoot-i-smoke/issues/127)) ([b57c477](https://github.com/amaurymartiny/shoot-i-smoke/commit/b57c477))
* Calculate integral of rawPm25 in history ([#143](https://github.com/amaurymartiny/shoot-i-smoke/issues/143)) ([99faf04](https://github.com/amaurymartiny/shoot-i-smoke/commit/99faf04))
* Distance is measured in mi for en ([#153](https://github.com/amaurymartiny/shoot-i-smoke/issues/153)) ([13c08b5](https://github.com/amaurymartiny/shoot-i-smoke/commit/13c08b5))
* Remove tracking GPS and AQI history ([#202](https://github.com/amaurymartiny/shoot-i-smoke/issues/202)) ([90b0393](https://github.com/amaurymartiny/shoot-i-smoke/commit/90b0393))
* Spanish Translations added ([#83](https://github.com/amaurymartiny/shoot-i-smoke/issues/83)) ([84cbf1c](https://github.com/amaurymartiny/shoot-i-smoke/commit/84cbf1c))
* Store history data each hour ([#109](https://github.com/amaurymartiny/shoot-i-smoke/issues/109)) ([079ab7c](https://github.com/amaurymartiny/shoot-i-smoke/commit/079ab7c)), closes [#72](https://github.com/amaurymartiny/shoot-i-smoke/issues/72) [#77](https://github.com/amaurymartiny/shoot-i-smoke/issues/77) [#79](https://github.com/amaurymartiny/shoot-i-smoke/issues/79) [#81](https://github.com/amaurymartiny/shoot-i-smoke/issues/81) [#83](https://github.com/amaurymartiny/shoot-i-smoke/issues/83) [#84](https://github.com/amaurymartiny/shoot-i-smoke/issues/84) [#85](https://github.com/amaurymartiny/shoot-i-smoke/issues/85) [#87](https://github.com/amaurymartiny/shoot-i-smoke/issues/87) [#88](https://github.com/amaurymartiny/shoot-i-smoke/issues/88) [#90](https://github.com/amaurymartiny/shoot-i-smoke/issues/90) [#91](https://github.com/amaurymartiny/shoot-i-smoke/issues/91) [#92](https://github.com/amaurymartiny/shoot-i-smoke/issues/92) [#95](https://github.com/amaurymartiny/shoot-i-smoke/issues/95) [#94](https://github.com/amaurymartiny/shoot-i-smoke/issues/94)
* Track app focus and exit ([#219](https://github.com/amaurymartiny/shoot-i-smoke/issues/219)) ([72079c7](https://github.com/amaurymartiny/shoot-i-smoke/commit/72079c7))



## [1.3.1](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.3.0...v1.3.1) (2019-04-17)


### Bug Fixes

* Possible dark video background issue fix ([#70](https://github.com/amaurymartiny/shoot-i-smoke/issues/70)) ([d948b36](https://github.com/amaurymartiny/shoot-i-smoke/commit/d948b36))
* Use video with white background ([#65](https://github.com/amaurymartiny/shoot-i-smoke/issues/65)) ([a84263e](https://github.com/amaurymartiny/shoot-i-smoke/commit/a84263e))
* video black screen ([#64](https://github.com/amaurymartiny/shoot-i-smoke/issues/64)) ([1aac378](https://github.com/amaurymartiny/shoot-i-smoke/commit/1aac378))



# [1.3.0](https://github.com/amaurymartiny/shoot-i-smoke/compare/v1.2.1...v1.3.0) (2019-03-22)


### Features

* add clearer error messages ([#61](https://github.com/amaurymartiny/shoot-i-smoke/issues/61)) ([70fbe70](https://github.com/amaurymartiny/shoot-i-smoke/commit/70fbe70))
