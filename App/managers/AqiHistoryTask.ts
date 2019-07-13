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

import { Result } from 'expo-background-fetch';
import { defineTask } from 'expo-task-manager';
import * as C from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { AsyncStorage } from 'react-native';
import Sentry from 'sentry-expo';

import { GPS_ASYNC_STORAGE } from './GpsTask';
import { fetchApiAndSave } from '../stores/fetchApi';
import { LatLng } from '../stores/location';
import { sideEffect, toError } from '../util/fp';

export const AQI_HISTORY_TASK = 'AQI_HISTORY_TASK';

/**
 * This task will fetch API data from remote and save to SQLite database
 */
defineTask(AQI_HISTORY_TASK, () => {
  pipe(
    TE.tryCatch(() => AsyncStorage.getItem(GPS_ASYNC_STORAGE), toError),
    TE.chain(gpsString =>
      TE.fromEither(
        E.fromNullable(new Error(`AsyncStorage ${GPS_ASYNC_STORAGE} is empty`))(
          gpsString
        )
      )
    ),
    TE.chain(gpsString =>
      TE.fromEither(E.tryCatch(() => JSON.parse(gpsString) as LatLng, toError))
    ),
    TE.chain(gps =>
      TE.rightIO(
        sideEffect(C.log(`<AqiHistoryTask> - defineTask - Fetching API`), gps)
      )
    ),
    TE.chain(gps => fetchApiAndSave(gps)),
    TE.fold(
      err => {
        console.log(`<AqiHistoryTask> - defineTask - Error ${err.message}`);
        Sentry.captureException(err);

        return T.of(Result.Failed);
      },
      () => T.of(Result.NewData)
    )
  )();
});
