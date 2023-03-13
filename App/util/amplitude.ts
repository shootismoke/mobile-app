// Shoot! I Smoke
// Copyright (C) 2018-2023  Marcelo S. Coelho, Amaury M.

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import * as Amplitude from 'expo-analytics-amplitude';
import Constants from 'expo-constants';
import { useEffect } from 'react';

import { sentryError } from './sentry';

export type AmplitudeEvent =
	| 'API_DAILY_REQUEST'
	| 'API_DAILY_RESPONSE'
	| 'API_DAILY_RESPONSE_AQICN'
	| 'API_DAILY_RESPONSE_OPENAQ'
	| 'API_DAILY_ERROR'
	| 'APP_REFOCUS'
	| 'APP_EXIT'
	| 'LOADING_SCREEN_OPEN'
	| 'LOADING_SCREEN_CLOSE'
	| 'HOME_SCREEN_OPEN'
	| 'HOME_SCREEN_CLOSE'
	| 'HOME_SCREEN_DAILY_CLICK'
	| 'HOME_SCREEN_WEEKLY_CLICK'
	| 'HOME_SCREEN_MONTHLY_CLICK'
	| 'HOME_SCREEN_BETA_INACCURATE_CLICK'
	| 'HOME_SCREEN_SHARE_CLICK'
	| 'HOME_SCREEN_DETAILS_CLICK'
	| 'HOME_SCREEN_ABOUT_CLICK'
	| 'HOME_SCREEN_ABOUT_WHY_SO_FAR_CLICK'
	| 'HOME_SCREEN_SHARE_CLICK'
	| 'HOME_SCREEN_CHANGE_LOCATION_CLICK'
	| 'HOME_SCREEN_NOTIFICATIONS_OPEN_PICKER'
	| 'HOME_SCREEN_NOTIFICATIONS_CANCEL'
	| 'HOME_SCREEN_NOTIFICATIONS_NEVER'
	| 'HOME_SCREEN_NOTIFICATIONS_DAILY'
	| 'HOME_SCREEN_NOTIFICATIONS_WEEKLY'
	| 'HOME_SCREEN_NOTIFICATIONS_MONTHLY'
	| 'HOME_SCREEN_NOTIFICATIONS_ERROR'
	| 'HOME_SCREEN_NOTIFICATIONS_PERMISSIONS_DENIED'
	| 'ABOUT_SCREEN_OPEN'
	| 'ABOUT_SCREEN_CLOSE'
	| 'ABOUT_SCREEN_SETTINGS_KM'
	| 'ABOUT_SCREEN_SETTINGS_MILE'
	| 'DETAILS_SCREEN_OPEN'
	| 'DETAILS_SCREEN_CLOSE'
	| 'SEARCH_SCREEN_OPEN'
	| 'SEARCH_SCREEN_CLOSE'
	| 'SEARCH_SCREEN_SEARCH'
	| 'ERROR_SCREEN_OPEN'
	| 'ERROR_SCREEN_CLOSE'
	| 'ERROR_SCREEN_CHANGE_LOCATION_CLICK';

export function setupAmplitude(): Promise<void> {
	return typeof Constants.expoConfig?.extra?.amplitudeApiKey === 'string'
		? Amplitude.initializeAsync(
				Constants.expoConfig?.extra?.amplitudeApiKey
		  ).then(() => {
				Amplitude.setUserPropertiesAsync({
					sisVersion: Constants.expoConfig?.version,
				}).catch(sentryError('setupAmplitude'));
				// Disable tracking all PII. Note: they are also disabled on
				// Amplitude's dashboard.
				// See https://help.amplitude.com/hc/en-us/articles/115002278527-iOS-SDK-Installation#disable-automatic-tracking-of-user-properties
				// See https://help.amplitude.com/hc/en-us/articles/115002935588-Android-SDK-Installation#disable-automatic-tracking-of-user-properties
				Amplitude.setTrackingOptionsAsync({
					disableAdid: true,
					disableCarrier: true,
					disableDMA: true,
					disableIDFV: true,
					disableIPAddress: true,
					disableLatLng: true,
				}).catch(sentryError('setupAmplitude'));
		  })
		: Promise.resolve();
}

type Json = string | number | boolean | null | JsonObject | JsonArray;

interface JsonObject {
	[property: string]: Json;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JsonArray extends Array<Json> {}

export function track(
	event: AmplitudeEvent,
	properties?: Record<string, Json>
): void {
	if (typeof Constants.expoConfig?.extra?.amplitudeApiKey !== 'string') {
		return;
	}

	(properties
		? Amplitude.logEventWithPropertiesAsync(event, properties)
		: Amplitude.logEventAsync(event)
	).catch(sentryError('amplitudeTrack'));
}

export function trackScreen(
	screen: 'LOADING' | 'HOME' | 'ABOUT' | 'DETAILS' | 'SEARCH' | 'ERROR'
): void {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		track(`${screen}_SCREEN_OPEN` as AmplitudeEvent);

		return (): void => track(`${screen}_SCREEN_CLOSE` as AmplitudeEvent);
	}, [screen]);
}
