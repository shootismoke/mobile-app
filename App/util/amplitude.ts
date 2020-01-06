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

import * as Amplitude from 'expo-analytics-amplitude';
import Constants from 'expo-constants';
import { useEffect } from 'react';

type AmplitudeEvent =
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
  | 'ABOUT_SCREEN_OPEN'
  | 'ABOUT_SCREEN_CLOSE'
  | 'DETAILS_SCREEN_OPEN'
  | 'DETAILS_SCREEN_CLOSE'
  | 'SEARCH_SCREEN_OPEN'
  | 'SEARCH_SCREEN_CLOSE'
  | 'SEARCH_SCREEN_SEARCH'
  | 'ERROR_SCREEN_OPEN'
  | 'ERROR_SCREEN_CLOSE'
  | 'ERROR_SCREEN_CHANGE_LOCATION_CLICK';

export function setupAmplitude(): Promise<void> {
  return Constants.manifest.extra.amplitudeApiKey
    ? Amplitude.initialize(Constants.manifest.extra.amplitudeApiKey).then(
        () => {
          Amplitude.setUserProperties({
            sisReleaseChannel:
              Constants.manifest.releaseChannel || 'development',
            sisRevisionId: Constants.manifest.revisionId || 'development',
            sisVersion: Constants.manifest.version
          });
        }
      )
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
  if (!Constants.manifest.extra.amplitudeApiKey) {
    return;
  }

  properties
    ? Amplitude.logEventWithProperties(event, properties)
    : Amplitude.logEvent(event);
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
