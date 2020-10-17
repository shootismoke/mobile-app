// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

/*
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import enUS from './languages/en-us';
import en from './languages/en.json';

i18n.fallbacks = true;
i18n.translations = {
	en,
	'en-US': enUS,
};

// If the locale is en-US, then we use the `en-US` file. For any other locale,
// we use the `en` file
i18n.locale =
	Localization.locale && Localization.locale.toLowerCase() === 'en-us'
		? 'en-US'
		: 'en';

const { t } = i18n;

export { i18n, t };
*/

import i18next, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// TODO make a script loader >> react-i18next-expo-backend
import components from './languages/en.json';

const languageDetector: LanguageDetectorAsyncModule = {
	type: 'languageDetector',
	async: true,
	detect: (cb: Function) => cb(Localization.locale.split('-')[0]),
	init: () => { },
	cacheUserLanguage: () => { }
}

i18next
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		debug: true,
		resources: {
			en: { components }
		},
		lng: 'en',
		ns: [
			'screen_about', 'screen_detail', 'screen_error',
			'screen_home', 'screen_loading', 'screen_search',
			'components'
		],
		fallbackLng: 'en'
	})

export default i18next
