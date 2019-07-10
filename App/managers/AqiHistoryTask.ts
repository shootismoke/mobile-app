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

import { defineTask } from 'expo-task-manager';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import Sentry from 'sentry-expo';

import { saveData } from './AqiHistoryDb';
import { fetchApi } from '../stores/fetchApi';
import { LatLng } from '../stores/location';

export const AQI_HISTORY_TASK = 'AQI_HISTORY_TASK';

defineTask(AQI_HISTORY_TASK, async ({ data, error }) => {
  if (error) {
    console.log(`<AqiHistoryTask> - defineTask - Error ${error.message}`);
    return;
  }

  if (data) {
    const { locations } = data as { locations: { coords: LatLng }[] };
    const { coords } = locations[0];

    console.log(`<AqiHistoryTask> - defineTask - Fetching API`);
    pipe(
      fetchApi(coords),
      TE.map(api => ({
        latitude: coords.latitude,
        longitude: coords.longitude,
        rawPm25: api.shootISmoke.rawPm25
      })),
      TE.chain(saveData),
      TE.fold(
        err => {
          console.log(`<AqiHistoryTask> - defineTask - Error ${err.message}`);
          Sentry.captureException(err);

          return T.of(undefined);
        },
        () => T.of(undefined)
      )
    )().catch(console.error);
  }
});
