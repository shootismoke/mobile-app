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

import { LatLng } from '@shootismoke/dataproviders/lib/types';
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
    promiseToTE(async () => {
      const reverse = await ExpoLocation.reverseGeocodeAsync(currentLocation);

      if (!reverse.length) {
        throw new Error('Reverse geocoding returned no results');
      }

      return reverse[0];
    }),
    TE.map(reverse => ({
      ...currentLocation,
      city: reverse.city,
      country: reverse.country,
      name:
        [reverse.street, reverse.city, reverse.country]
          .filter(x => x)
          .join(', ') ||
        // This case happens when e.g. we're in the middle of the ocean
        [reverse.name, reverse.country].filter(x => x).join(', ')
    }))
  );
}

export function fetchGpsPosition(): TE.TaskEither<
  Error,
  ExpoLocation.LocationData
> {
  return promiseToTE(async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    return ExpoLocation.getCurrentPositionAsync({
      timeout: 5000
    });
    // Uncomment to get other locations
    // return {
    //   coords: {
    //     latitude: Math.random() * 90,
    //     longitude: Math.random() * 90
    //   }
    // };
    // return {
    //   coords: {
    //     latitude: 48.4,
    //     longitude: 2.34
    //   }
    // };
  });
}
