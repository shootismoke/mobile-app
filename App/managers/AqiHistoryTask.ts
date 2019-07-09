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

import TaskManager from 'expo-task-manager';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import Sentry from 'sentry-expo';

import { saveData } from './AqiHistoryDb';
import { fetchApi, LatLng } from '../stores';

export const AQI_HISTORY_TASK = 'AQI_HISTORY_TASK';

TaskManager.defineTask(AQI_HISTORY_TASK, async ({ data, error }) => {
  if (error) {
    console.log(`<TaskManager> - defineTask - Error ${error.message}`);
    return;
  }

  if (data) {
    const { locations } = data as { locations: { coords: LatLng }[] };
    const { coords } = locations[0];

    pipe(
      fetchApi(coords),
      TE.map(api => ({ ...coords, rawPm25: api.shootISmoke.rawPm25 })),
      TE.chain(saveData),
      TE.fold(
        err => {
          console.log(`<TaskManager> - defineTask - Error ${err.message}`);
          Sentry.captureException(err);

          return T.of(undefined);
        },
        () => T.of(undefined)
      )
    )();
  }
});
