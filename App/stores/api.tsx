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

import { raceApiPromise, Api, noop } from '@shootismoke/ui';
import Constants from 'expo-constants';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { track } from '../util/amplitude';
import { promiseToTE } from '../util/fp';
import { sentryError } from '../util/sentry';
import { ErrorContext } from './error';
import { CurrentLocationContext } from './location';

interface Context {
	api?: Api;
	reloadApp: () => void;
}

export const ApiContext = createContext<Context>({ reloadApp: noop });

interface ApiContextProviderProps {
	children: JSX.Element;
}

// Timeout, in ms, after which we abandon the api request.
const API_TIMEOUT = 5000;

/**
 * withTimeout wraps another promise, and rejects if the inner promise
 * time outs after `timeout`.
 * @param p - Promise to add timeout to.
 */
export function withTimeout<T>(p: Promise<T>, timeout: number): Promise<T> {
	return Promise.race([
		new Promise<T>((_resolve, reject) => {
			setTimeout(
				() => reject('Request to fetch API data timed out.'),
				timeout
			);
		}),
		p,
	]);
}

export function ApiContextProvider({
	children,
}: ApiContextProviderProps): React.ReactElement {
	const { currentLocation, setCurrentLocation } = useContext(
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

		track('API_DAILY_REQUEST');
		pipe(
			promiseToTE(
				() =>
					// raceApiPromise will fetch the API data from different
					// sources, and return the first result. We also add a
					// timeout on these requests.
					withTimeout(
						raceApiPromise(currentLocation, {
							aqicnToken: Constants.manifest.extra
								.aqicnToken as string,
						}),
						API_TIMEOUT
					),
				'ApiContext'
			),
			TE.fold(
				(error) => {
					setError(error);
					track('API_DAILY_ERROR');

					return T.of(undefined);
				},
				(newApi) => {
					setApi(newApi);
					track('API_DAILY_RESPONSE');

					return T.of(undefined);
				}
			)
		)().catch(sentryError('ApiContextProvider'));
	}, [latitude, longitude]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<ApiContext.Provider
			value={{
				api,
				// eslint-disable-next-line
				reloadApp: () => setCurrentLocation({ ...currentLocation! }), // Small trick to re-run effect
			}}
		>
			{children}
		</ApiContext.Provider>
	);
}
