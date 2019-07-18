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

import * as C from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { defineTask } from 'expo-task-manager';
import { AsyncStorage } from 'react-native';

import { LatLng } from '../stores/fetchGpsPosition';
import { sideEffect, toError } from '../util/fp';

export const GPS_TASK = 'GPS_TASK';
const GPS_ASYNC_STORAGE = 'GPS_ASYNC_STORAGE';

interface LastKnownGps extends LatLng {
  creationTime: string;
}

/**
 * Get last saved value of GPS location in async storage
 * TODO Maybe this should return `TaskEither<Error, Option<LastKnownGps>>`
 */
export function getLastKnownGps () {
  return pipe(
    TE.tryCatch(() => AsyncStorage.getItem(GPS_ASYNC_STORAGE), toError),
    TE.chain(gpsString =>
      TE.fromEither(
        E.fromNullable(new Error(`AsyncStorage ${GPS_ASYNC_STORAGE} is empty`))(
          gpsString
        )
      )
    ),
    TE.chain(gpsString =>
      TE.rightIO(
        sideEffect(
          C.log(
            `<AqiHistoryTask> - defineTask - Got last known location ${gpsString}`
          ),
          gpsString
        )
      )
    ),
    TE.chain(gpsString =>
      TE.fromEither(
        E.tryCatch(() => JSON.parse(gpsString) as LastKnownGps, toError)
      )
    )
  );
}

/**
 * This task will check user GPS location and save to AsyncStorage
 */
defineTask(GPS_TASK, async ({ data, error }) => {
  try {
    if (error) {
      console.log(`<GpsTask> - defineTask - Error ${error.message}`);
      return;
    }

    if (data) {
      const { locations } = data as { locations: { coords: LatLng }[] };
      const { coords } = locations[0];

      // Using TE.tryCatch here seems overkill
      AsyncStorage.setItem(
        GPS_ASYNC_STORAGE,
        JSON.stringify({
          creationTime: new Date().toISOString(),
          latitude: coords.latitude,
          longitude: coords.longitude
        })
      )
        .then(() =>
          console.log('<GpsTask> - defineTask - Updated Gps Location')
        )
        .catch(error =>
          console.log(`<GpsTask> - defineTask - Error ${error.message}`)
        );
    }
  } catch (err) {
    console.log(`<GpsTask> - defineTask - Error ${err.message}`);
  }
});
