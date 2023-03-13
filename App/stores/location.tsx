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

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { noop } from '@shootismoke/ui';
import { sentryError } from '../util/sentry';
import { ErrorContext } from './error';
import {
	fetchGpsPosition,
	fetchReverseGeocode,
	Location,
	withTimeout,
} from './util/fetchGpsPosition';

const LAST_KNOWN_LOCATION_KEY = 'LAST_KNOWN_LOCATION';

interface LocationWithSetter {
	currentLocation?: Location;
	isGps: boolean;
	setCurrentLocation: (location?: Location) => void;
}

export const GpsLocationContext = createContext<{
	gps?: Location;
	setGpsLocation: (location?: Location) => void;
}>({ setGpsLocation: noop });
export const CurrentLocationContext = createContext<LocationWithSetter>({
	isGps: false,
	setCurrentLocation: noop,
});

// fetchFromAsyncStorage will try to fetch the last known location from
// AsyncStorage, or throw an error if there is no last known location.
async function fetchFromAsyncStorage(err: Error): Promise<Location> {
	try {
		const locationString = await AsyncStorage.getItem(
			LAST_KNOWN_LOCATION_KEY
		);

		// Skip parsing if AsyncStorage is empty.
		if (!locationString) {
			throw new Error('AsyncStorage has no LAST_KNOWN_LOCATION');
		}

		const parsedLocation = JSON.parse(locationString) as Location;

		// Make sure parsedLocation is well-formed.
		if (!parsedLocation.latitude || !parsedLocation.longitude) {
			throw new Error(
				'AsyncStorage has ill-formatted LAST_KNOWN_LOCATION'
			);
		}

		console.log(
			'[LocationContext]: Using last known location',
			parsedLocation.name
		);
		return parsedLocation;
	} catch (_e) {
		throw err;
	}
}

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
		withTimeout(fetchGpsPosition(), 10000, 'for GPS position ')
			.then(({ coords }) => {
				setGpsLocation(coords);
				// Set current location now, so that we can use it asap to
				// fetch the API data.
				// https://github.com/shootismoke/mobile-app/issues/323
				setCurrentLocation(coords);

				// Note: We don't want to wait for the reverse geocode to
				// finish, so we don't await/return it.
				withTimeout(
					fetchReverseGeocode(coords).then((gpsLocation) => {
						setGpsLocation(gpsLocation);
						setCurrentLocation(coords);
					}),
					5000,
					'for fetchReverseGeocode '
				).catch(sentryError('fetchReverseGeocode'));
			})
			.catch((err) =>
				fetchFromAsyncStorage(err as Error).then(setCurrentLocation)
			)
			.catch((err: Error) => {
				sentryError('LocationContextProvider')(err);
				setError(err);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		currentLocation &&
			AsyncStorage.setItem(
				LAST_KNOWN_LOCATION_KEY,
				JSON.stringify(currentLocation)
			)
				.then(() => {
					console.log(
						'[LocationContext]: Last known location updated to',
						JSON.stringify(currentLocation)
					);
				})
				.catch(sentryError('LocationContextProvider'));
	}, [currentLocation]);

	return (
		<GpsLocationContext.Provider
			value={{ gps: gpsLocation, setGpsLocation }}
		>
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
