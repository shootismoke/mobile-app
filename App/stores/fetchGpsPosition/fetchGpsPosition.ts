// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

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

import * as BackgroundFetch from 'expo-background-fetch';
import * as ExpoLocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import { isTaskRegisteredAsync } from 'expo-task-manager';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { SAVE_DATA_INTERVAL } from '../../managers/AqiHistoryDb';
import { AQI_HISTORY_TASK } from '../../managers/AqiHistoryTask';
import { GPS_TASK } from '../../managers/GpsTask';
import { toError } from '../../util/fp';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Location extends LatLng {
  city?: string;
  country?: string;
  name?: string;
}

export function fetchReverseGeocode (currentLocation: LatLng) {
  return pipe(
    TE.tryCatch(async () => {
      const reverse = await ExpoLocation.reverseGeocodeAsync(currentLocation);

      if (!reverse.length) {
        throw new Error('Reverse geocoding returned no results');
      }

      return reverse[0];
    }, toError),
    TE.map(
      reverse =>
        ({
          ...currentLocation,
          city: reverse.city,
          country: reverse.country,
          name:
            [reverse.street, reverse.city, reverse.country]
              .filter(x => x)
              .join(', ') ||
            // This case happens when e.g. we're in the middle of the ocean
            [reverse.name, reverse.country].filter(x => x).join(', ')
        } as Location)
    )
  );
}

export function fetchGpsPosition () {
  return TE.tryCatch(async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Start the task to record periodically on the background the location
    const isGpsRegistered = await isTaskRegisteredAsync(GPS_TASK);
    if (!isGpsRegistered) {
      ExpoLocation.startLocationUpdatesAsync(GPS_TASK);
    }
    // Start the task to record periodically on the background the location
    const isAqiRegistered = await isTaskRegisteredAsync(AQI_HISTORY_TASK);
    if (!isAqiRegistered) {
      BackgroundFetch.registerTaskAsync(AQI_HISTORY_TASK, {
        minimumInterval: SAVE_DATA_INTERVAL, // in s
        startOnBoot: true,
        stopOnTerminate: false
      });
      // Apparently this is needed on iOS
      // https://github.com/expo/expo/issues/3582#issuecomment-480924126
      BackgroundFetch.setMinimumIntervalAsync(SAVE_DATA_INTERVAL);
    }

    return ExpoLocation.getCurrentPositionAsync({
      timeout: 5000
    });
    // Uncomment to get other locations
    // const coords = {
    //   latitude: Math.random() * 90,
    //   longitude: Math.random() * 90
    // };
    // const coords = {
    //   latitude: 48.4,
    //   longitude: 2.34
    // };
  }, toError);
}
