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

import { LatLng } from '@shootismoke/dataproviders';
import haversine from 'haversine';

import { Api } from '../stores/api';
import { DistanceUnit } from '../stores/distanceUnit';

// Above this distance (km), we consider the station too far from the user
export const MAX_DISTANCE_TO_STATION = 10;

/**
 * Station given by the Waqi API is fucked up. Sometimes it's [lat, lng],
 * sometimes it's [lng, lat].
 * We check here with the user's real currentLocation coordinates, and take the
 * "closest" one.
 *
 * @param currentLocation - An object containing {latitude, longitude}
 * representing the user's current location.
 * @param station - An object containing {latitude, longitude} representing
 * the station's location.
 */
export function getCorrectLatLng(
  currentLocation: LatLng,
  station: LatLng
): LatLng {
  const d1 =
    Math.abs(currentLocation.latitude - station.latitude) +
    Math.abs(currentLocation.longitude - station.longitude);

  const d2 =
    Math.abs(currentLocation.latitude - station.longitude) +
    Math.abs(currentLocation.longitude - station.latitude);

  if (d1 < d2) return station;
  return {
    ...station,
    latitude: station.longitude,
    longitude: station.latitude
  };
}

/**
 * Get distance from current location to station.
 *
 * @param currentLocation - The current location of the user.
 * @param api - The api object returned by remote data.
 * @param unit - The unit of measure returned.
 */
export function distanceToStation(
  currentLocation: LatLng,
  api: Api,
  unit: DistanceUnit = 'km'
): number {
  return Math.round(
    haversine(
      currentLocation,
      getCorrectLatLng(currentLocation, api.pm25.coordinates),
      { unit }
    )
  );
}

/**
 * Returns true if the station is at more than {@link MAX_DISTANCE_TO_STATION}
 * kilometers away from the current location
 *
 * @param currentLocation - The current location of the user.
 * @param api - The api object returned by remote data.
 */
export function isStationTooFar(currentLocation: LatLng, api: Api): boolean {
  return distanceToStation(currentLocation, api) > MAX_DISTANCE_TO_STATION;
}
