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

import type { LatLng } from '@shootismoke/dataproviders';
import * as ExpoLocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { promiseToTE } from '../../util/fp';

export interface Location extends LatLng {
	city?: string;
	country?: string;
	name?: string;
}

export function fetchReverseGeocode(
	currentLocation: LatLng
): TE.TaskEither<Error, Location> {
	return pipe(
		promiseToTE(
			() => ExpoLocation.reverseGeocodeAsync(currentLocation),
			'fetchReverseGeocode'
		),
		TE.chain((reverse) =>
			reverse.length
				? TE.right(reverse[0])
				: TE.left(new Error('Reverse geocoding returned no results'))
		),
		TE.map((reverse) => ({
			...currentLocation,
			city: reverse.city || undefined, // Convert null to undefined.
			country: reverse.country || undefined, // Convert null to undefined.
			name:
				[reverse.street, reverse.city, reverse.country]
					.filter((x) => x)
					.join(', ') ||
				// This case happens when e.g. we're in the middle of the ocean
				[reverse.name, reverse.country].filter((x) => x).join(', '),
		}))
	);
}

export function fetchGpsPosition(): TE.TaskEither<
	Error,
	ExpoLocation.LocationObject
> {
	return pipe(
		promiseToTE(
			() => Permissions.askAsync(Permissions.LOCATION),
			'fetchGpsPosition'
		),
		TE.chain(({ status }) =>
			status === 'granted'
				? TE.right(undefined)
				: TE.left(new Error('Permission to access location was denied'))
		),
		TE.chain(() =>
			promiseToTE(
				() => ExpoLocation.getCurrentPositionAsync(),
				// Uncomment to get other locations
				// Promise.resolve({
				//   coords: {
				//     latitude: Math.random() * 90,
				//     longitude: Math.random() * 90
				//   }
				// });
				// Promise.resolve({
				//   coords: {
				//     latitude: 48.4,
				//     longitude: 2.34
				//   }
				// });
				'fetchGpsPosition'
			)
		)
	);
}
