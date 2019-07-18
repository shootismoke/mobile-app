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
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { AsyncStorage } from 'react-native';
import Sentry from 'sentry-expo';

import { getLastKnownGps } from './GpsTask';
import { fetchApiAndSave } from '../stores/fetchApi';

export const AQI_HISTORY_TASK = 'AQI_HISTORY_TASK';
export const AQI_HISTORY_LAST_FETCH_ATTEMPT = 'AQI_HISTORY_LAST_FETCH_ATTEMPT';
export const AQI_HISTORY_LAST_FETCH_RESULT = 'AQI_HISTORY_LAST_FETCH_RESULT';

/**
 * This task will fetch API data from remote and save to SQLite database
 */
defineTask(AQI_HISTORY_TASK, () => {
  // For dev purposes
  AsyncStorage.setItem(
    AQI_HISTORY_LAST_FETCH_ATTEMPT,
    new Date().toISOString()
  );

  return pipe(
    getLastKnownGps(),
    TE.chain(gps => fetchApiAndSave(gps)),
    TE.fold(
      err => {
        console.log(`<AqiHistoryTask> - defineTask - Error ${err.message}`);
        Sentry.captureException(err);

        // For dev purposes
        AsyncStorage.setItem(AQI_HISTORY_LAST_FETCH_RESULT, err.message);

        return T.of(Result.Failed);
      },
      () => T.of(Result.NewData)
    )
  )();
});
