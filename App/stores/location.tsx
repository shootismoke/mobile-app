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

// fetch will try to fetch the GPS position, and if it fails, it will try to
// fetch the last known location from AsyncStorage.
async function fetch(): Promise<[Location | undefined, Location | undefined]> {
	try {
		const { coords } = await fetchGpsPosition();
		// Set lat/lng for now, set the reverse location later
		// @see https://github.com/shootismoke/mobile-app/issues/323
		console.log(
			`<LocationContext> - fetchGpsPosition - Got GPS ${JSON.stringify(
				coords
			)}`
		);

		const reverseGeocode = await fetchReverseGeocode(coords);
		return [reverseGeocode, reverseGeocode];
	} catch (err) {
		try {
			const locationString = await AsyncStorage.getItem(
				'LAST_KNOWN_LOCATION'
			);

			// Skip parsing if AsyncStorage is empty.
			if (!locationString) {
				return [undefined, undefined];
			}

			const parsedLocation = JSON.parse(locationString) as Location;

			// Make sure parsedLocation is well-formed.
			if (!parsedLocation.latitude || !parsedLocation.longitude) {
				throw new Error(
					'AsyncStorage has ill-formatted LAST_KNOWN_LOCATION'
				);
			}

			return [undefined, parsedLocation];
		} catch (innerError) {
			sentryError('LocationContextProvider-AsyncStorage')(
				innerError as Error
			);
			throw err;
		}
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
		withTimeout(fetch(), 10000, 'for GPS location ')
			.then(([gpsLocation, currentLocation]) => {
				setGpsLocation(gpsLocation);
				setCurrentLocation(currentLocation);
			})
			.catch((err: Error) => {
				sentryError('LocationContextProvider')(err);
				setError(err);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		(currentLocation
			? AsyncStorage.setItem(
					LAST_KNOWN_LOCATION_KEY,
					JSON.stringify(currentLocation)
			  )
			: AsyncStorage.removeItem(LAST_KNOWN_LOCATION_KEY)
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
