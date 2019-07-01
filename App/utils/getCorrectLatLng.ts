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

/**
 * Station given by the Waqi API is fucked up. Sometimes it's [lat, lng],
 * sometimes it's [lng, lat].
 * We check here with the user's real currentLocation coordinates, and take the
 * "closest" one.
 *
 * @param {*} currentLocation - An object containing {latitude, longitude}
 * representing the user's current location.
 * @param {*} station - An object containing {latitude, longitude} representing
 * the station's location.
 */
export const getCorrectLatLng = (currentLocation, station) => {
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
};
