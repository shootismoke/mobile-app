// Shoot! I Smoke
// Copyright (C) 2018-2023  Marcelo S. Coelho, Amaury M.

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { raceApiPromise, Api, noop } from '@shootismoke/ui';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { track } from '../util/amplitude';
import { ErrorContext } from './error';
import { CurrentLocationContext, GpsLocationContext } from './location';
import { withTimeout } from './util';

interface Context {
	api?: Api;
	reloadApp: () => void;
}

export const ApiContext = createContext<Context>({ reloadApp: noop });

interface ApiContextProviderProps {
	children: JSX.Element;
}

// Timeout, in ms, after which we abandon the api request.
const API_TIMEOUT = 10000;

export function ApiContextProvider({
	children,
}: ApiContextProviderProps): React.ReactElement {
	const { currentLocation, setCurrentLocation, isGps } = useContext(
		CurrentLocationContext
	);
	const { setError } = useContext(ErrorContext);
	const { gps, setGpsLocation } = useContext(GpsLocationContext);
	const [api, setApi] = useState<Api | undefined>(undefined);

	const { latitude, longitude } = currentLocation || {};

	useEffect(() => {
		setApi(undefined);
		setError(undefined);

		if (!currentLocation || !latitude || !longitude) {
			return;
		}

		track('API_DAILY_REQUEST');

		console.log('[ApiContext] Fetching API data for', currentLocation.name);

		// raceApiPromise will fetch the API data from different
		// sources, and return the first result. We also add a
		// timeout on these requests.
		withTimeout(
			raceApiPromise(currentLocation, {
				aqicn: {
					token: Constants.expoConfig?.extra?.aqicnToken as string,
				},
				openaq: {
					// Limiting to only fetch pm25. Sometimes, when
					// we search for all pollutants, the pm25 ones
					// don't get returned within the result limits.
					parameter: ['pm25'],
				},
			}),
			API_TIMEOUT,
			'for aqicn/openaq API '
		)
			.then((newApi) => {
				setApi(newApi);

				// Sometimes, the reverse geocoding on the location doesn't
				// work. In this case, we fill in the gps reverse geocoding
				// info with the API one.
				if (isGps && gps && !gps?.name) {
					const newLocation = {
						...gps,
						name: [
							newApi.results[0].city,
							newApi.results[0].country,
						].join(', '),
						city: newApi.results[0].city,
						country: newApi.results[0].country,
					};
					setGpsLocation(newLocation);
					setCurrentLocation(newLocation);
				}

				track('API_DAILY_RESPONSE');
				track(
					`API_DAILY_RESPONSE_${
						newApi.results[0].location
							.split('|')[0]
							.toUpperCase() as 'AQICN' | 'OPENAQ'
					}`
				);
			})
			.catch((error) => {
				setError(error as Error);
				track('API_DAILY_ERROR');
			});
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
