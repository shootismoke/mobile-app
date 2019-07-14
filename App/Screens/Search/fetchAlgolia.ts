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

import axios from 'axios';
import Constants from 'expo-constants';
import { pipe } from 'fp-ts/lib/pipeable';
import * as C from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

import { LatLng } from '../../stores';
import { retry, sideEffect, toError } from '../../util/fp';

// As per https://community.algolia.com/places/rest.html
const algoliaUrls = [
  'https://places-dsn.algolia.net',
  'https://places-1.algolianet.com',
  'https://places-2.algolianet.com',
  'https://places-3.algolianet.com'
];

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/132720a17e15cdfcffade54dd4a23a21c1e16831/types/algoliasearch/index.d.ts#L2072
const AlgoliaHitT = t.exact(
  t.intersection([
    t.type({
      _geoloc: t.type({
        lat: t.number,
        lng: t.number
      }),
      country: t.string,
      locale_names: t.array(t.string),
      objectID: t.string
    }),
    t.partial({
      city: t.array(t.string),
      county: t.array(t.string)
    })
  ])
);
export type AlgoliaHit = t.TypeOf<typeof AlgoliaHitT>;

const AxiosResponseT = t.type({
  data: t.type({
    hits: t.array(AlgoliaHitT)
  })
});

export function fetchAlgolia (search: string, gps?: LatLng) {
  return retry(algoliaUrls.length, status =>
    pipe(
      TE.rightIO(
        C.log(
          `<Search> - fetchAlgolia - Attempt #${status.iterNumber}: ${
            algoliaUrls[(status.iterNumber - 1) % algoliaUrls.length]
          }/1/places/query`
        )
      ),
      TE.chain(() =>
        TE.tryCatch(
          () =>
            axios.post(
              `${
                algoliaUrls[(status.iterNumber - 1) % algoliaUrls.length]
              }/1/places/query`,
              {
                aroundLatLng: gps
                  ? `${gps.latitude},${gps.longitude}`
                  : undefined,
                hitsPerPage: 10,
                language: 'en',
                query: search
              },
              {
                headers:
                  Constants.manifest.extra.algoliaApplicationId &&
                  Constants.manifest.extra.algoliaApiKey
                    ? {
                      'X-Algolia-Application-Id':
                          Constants.manifest.extra.algoliaApplicationId,
                      'X-Algolia-API-Key':
                          Constants.manifest.extra.algoliaApiKey
                    }
                    : undefined,

                timeout: 3000
              }
            ),
          toError
        )
      ),
      TE.chain(response =>
        T.of(
          pipe(
            AxiosResponseT.decode(response),
            E.mapLeft(failure),
            E.mapLeft(errs => errs[0]), // Only show 1st error
            E.mapLeft(Error)
          )
        )
      ),
      TE.map(response => response.data.hits),
      TE.chain((hits: AlgoliaHit[]) =>
        TE.rightIO(
          sideEffect(
            C.log(`<Search> - fetchAlgolia - Got ${hits.length} results`),
            hits
          )
        )
      )
    )
  );
}
