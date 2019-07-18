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
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

import { Location } from '../fetchGpsPosition';
import * as dataSources from './dataSources';
import { saveData } from '../../managers/AqiHistoryDb';
import { retry, sideEffect, toError } from '../../util/fp';
import { isStationTooFar } from '../../util/station';

const ApiT = t.type({
  aqi: t.number,
  attributions: t.array(
    t.type({
      name: t.string,
      url: t.union([t.string, t.undefined])
    })
  ),
  city: t.type({
    geo: t.tuple([t.number, t.number]),
    name: t.string,
    url: t.union([t.string, t.undefined])
  }),
  dominentpol: t.string,
  iaqi: t.record(
    t.string,
    t.type({
      v: t.number
    })
  ),
  idx: t.number,
  shootISmoke: t.type({
    cigarettes: t.number,
    rawPm25: t.number
  }),
  time: t.type({
    s: t.union([t.string, t.undefined]),
    tz: t.union([t.string, t.undefined]),
    v: t.number
  })
});
export type Api = t.TypeOf<typeof ApiT>;

// We currently have 2 sources, aqicn, and windWaqi
// We put them in an array
const sources = [
  { name: 'aqicn', run: dataSources.aqicn },
  { name: 'windWaqi', run: dataSources.windWaqi }
];

export function fetchApi (gps: Location) {
  return retry(sources.length, status =>
    pipe(
      TE.rightIO(
        C.log(
          `<ApiContext> - fetchApi - Attempt #${status.iterNumber}: ${
            sources[(status.iterNumber - 1) % sources.length].name
          }`
        )
      ),
      TE.chain(() =>
        TE.tryCatch(
          () => sources[(status.iterNumber - 1) % sources.length].run(gps),
          toError
        )
      ),
      TE.chain(response =>
        T.of(
          pipe(
            ApiT.decode(response),
            E.mapLeft(failure),
            E.mapLeft(errs => errs[0]), // Only show 1st error
            E.mapLeft(Error)
          )
        )
      ),
      TE.chain((api: Api) =>
        TE.rightIO(
          sideEffect(
            C.log(
              `<ApiContext> - fetchApi - Got result ${JSON.stringify(api)}`
            ),
            api
          )
        )
      )
    )
  );
}

export function saveApi (gps: Location, api: Api) {
  return pipe(
    isStationTooFar(gps, api)
      ? TE.left(new Error('Station too far, not saving'))
      : TE.right({
        latitude: gps.latitude,
        longitude: gps.longitude,
        rawPm25: api.shootISmoke.rawPm25,
        station: api.attributions[0].name,
        city: gps.city,
        country: gps.country
      }),
    TE.chain(saveData)
  );
}
