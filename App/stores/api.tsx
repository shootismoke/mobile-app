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

import {
  LatLng,
  Normalized,
  ProviderPromise
} from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';
import Constants from 'expo-constants';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import promiseAny from 'p-any';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { logFpError, promiseToTE, sideEffect } from '../util/fp';
import { noop } from '../util/noop';
import { pm25ToCigarettes } from '../util/secretSauce';
import { ErrorContext } from './error';
import { CurrentLocationContext } from './location';
import { createHistoryItem } from './util';

// FIXME Import from @shootismoke/convert
type OpenAQFormat = Normalized[0];

/**
 * Api is basically the normalized data from '@shootismoke/dataproviders',
 * where we make sure to add cigarette conversion
 */
export interface Api {
  normalized: Normalized;
  pm25: OpenAQFormat;
  shootismoke: {
    dailyCigarettes: number;
  };
}

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 * @param normalized - The normalized data to process
 */
function filterPm25(normalized: Normalized): Api {
  const pm25 = normalized.filter(({ parameter }) => parameter === 'pm25');

  if (pm25.length) {
    return {
      normalized,
      pm25: pm25[0],
      shootismoke: {
        dailyCigarettes: pm25ToCigarettes(pm25[0].value)
      }
    };
  } else {
    throw new Error('PM2.5 has not been measured by this station right now');
  }
}

/**
 * Fetch data parallely from difference data sources, and return the first
 * response
 *
 * @param gps - The GPS coordinates to fetch data for
 */
function race(gps: LatLng): TE.TaskEither<Error, Api> {
  // Helper function to fetch & normalize data for 1 provider
  async function fetchForProvider<DataByGps, DataByStation, Options>(
    provider: ProviderPromise<DataByGps, DataByStation, Options>,
    options?: Options
  ): Promise<Api> {
    const data = await provider.fetchByGps(gps, options);
    const normalized = provider.normalizeByGps(data);
    console.log(`Got data from ${provider.id}: ${JSON.stringify(normalized)}`);

    return filterPm25(normalized);
  }

  // Run these tasks parallely
  const tasks = [
    fetchForProvider(aqicn, {
      token: Constants.manifest.extra.aqicnToken
    }),
    fetchForProvider(openaq),
    fetchForProvider(waqi)
  ];

  // Return a Promise.any behavior between the tasks
  // FIXME How can one implement a Promise.any behavior with fp-ts?
  // @see https://github.com/amaurymartiny/shoot-i-smoke/issues/324
  return promiseToTE(() => promiseAny(tasks));
}

interface Context {
  api?: Api;
  reloadApp: () => void;
}

export const ApiContext = createContext<Context>({ reloadApp: noop });

interface ApiContextProviderProps {
  children: JSX.Element;
}

export function ApiContextProvider({
  children
}: ApiContextProviderProps): React.ReactElement {
  const { currentLocation, isGps, setCurrentLocation } = useContext(
    CurrentLocationContext
  );
  const { setError } = useContext(ErrorContext);
  const [api, setApi] = useState<Api | undefined>(undefined);

  const { latitude, longitude } = currentLocation || {};

  useEffect(() => {
    setApi(undefined);
    setError(undefined);

    if (!currentLocation || !latitude || !longitude) {
      return;
    }

    pipe(
      race(currentLocation),
      TE.chain(
        sideEffect(api =>
          isGps ? createHistoryItem(api) : TE.right(void undefined)
        )
      ),
      TE.fold(
        error => {
          setError(error);

          return T.of(void undefined);
        },
        newApi => {
          setApi(newApi);

          return T.of(void undefined);
        }
      )
    )().catch(logFpError('ApiContextProvider'));
  }, [latitude, longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ApiContext.Provider
      value={{
        api,
        // eslint-disable-next-line
        reloadApp: () => setCurrentLocation({ ...currentLocation! }) // Small trick to re-run effect
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
