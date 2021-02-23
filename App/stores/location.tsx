// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import { LatLng } from '@shootismoke/dataproviders';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

import { promiseToTE, sideEffect } from '../util/fp';
import { noop } from '@shootismoke/ui';
import { sentryError } from '../util/sentry';
import { ErrorContext } from './error';
import {
	fetchGpsPosition,
	fetchReverseGeocode,
	Location,
} from './util/fetchGpsPosition';

const LAST_KNOWN_LOCATION_KEY = 'LAST_KNOWN_LOCATION';

const DEFAULT_LAT_LNG: LatLng = {
	latitude: 0,
	longitude: 0,
};

interface LocationWithSetter {
	currentLocation?: Location;
	isGps: boolean;
	setCurrentLocation: (location?: Location) => void;
}

export const GpsLocationContext = createContext<Location | undefined>(
	DEFAULT_LAT_LNG
);
export const CurrentLocationContext = createContext<LocationWithSetter>({
	...DEFAULT_LAT_LNG,
	isGps: false,
	setCurrentLocation: noop,
});

export function LocationContextProvider({
	children,
}: {
	children: JSX.Element;
}): React.ReactElement {
	const { setError } = useContext(ErrorContext);

	const [gpsLocation, setGpsLocation] = useState<Location>();
	const [currentLocation, setCurrentLocation] = useState<Location>();

	// Fetch GPS location
	useEffect(() => {
		pipe(
			fetchGpsPosition(),
			TE.map(({ coords }) => coords),
			TE.chain(
				sideEffect((gps) => {
					// Set lat/lng for now, set the reverse location later
					// @see https://github.com/amaurym/shoot-i-smoke/issues/323
					console.log(
						`<LocationContext> - fetchGpsPosition - Got GPS ${JSON.stringify(
							gps
						)}`
					);
					setGpsLocation(gps);
					setCurrentLocation(gps);

					return TE.right(undefined);
				})
			),
			TE.chain((gps) =>
				TE.rightTask(
					pipe(
						fetchReverseGeocode(gps),
						TE.fold(() => T.of(gps as Location), T.of)
					)
				)
			),
			TE.orElse((err) =>
				pipe(
					promiseToTE(
						() => AsyncStorage.getItem('LAST_KNOWN_LOCATION'),
						'LocationContext'
					),
					TE.chain((locationString) => {
						// Skip parsing if AsyncStorage is empty.
						if (!locationString) {
							return TE.left(
								new Error(
									'AsyncStorage does not contain LAST_KNOWN_LOCATION'
								)
							);
						}

						const parsedLocation = JSON.parse(
							locationString
						) as Location;

						// Make sure parsedLocation is well-formed.
						return parsedLocation.latitude &&
							parsedLocation.longitude
							? TE.right(parsedLocation)
							: TE.left(
									new Error(
										'AsyncStorage has ill-formatted LAST_KNOWN_LOCATION'
									)
							  );
					}),
					// Show the initial error from fetchGpsPosition.
					TE.mapLeft(() => err)
				)
			),
			TE.fold(
				(err) => {
					setError(err);

					return T.of(undefined);
				},
				(location) => {
					console.log(
						`<LocationContext> - Got reverse location ${JSON.stringify(
							location
						)}`
					);
					setGpsLocation(location);
					setCurrentLocation(location);

					return T.of(undefined);
				}
			)
		)().catch(sentryError('LocationContextProvider'));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		AsyncStorage.setItem(
			LAST_KNOWN_LOCATION_KEY,
			JSON.stringify(currentLocation)
		).catch(sentryError('LocationContextProvider'));
	}, [currentLocation]);

	return (
		<GpsLocationContext.Provider value={gpsLocation}>
			<CurrentLocationContext.Provider
				value={{
					currentLocation,
					isGps:
						!!currentLocation &&
						!!gpsLocation &&
						currentLocation.latitude === gpsLocation.latitude &&
						currentLocation.longitude === gpsLocation.longitude,
					setCurrentLocation,
				}}
			>
				{children}
			</CurrentLocationContext.Provider>
		</GpsLocationContext.Provider>
	);
}
