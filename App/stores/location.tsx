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

import * as Permissions from 'expo-permissions';
import * as ExpoLocation from 'expo-location';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ErrorContext } from './error';
import { noop } from '../utils/noop';

export interface LatLng {
  latitude: number;
  longitude: number;
}

const DEFAULT_LAT_LNG: LatLng = {
  latitude: 0,
  longitude: 0
};

export interface Location extends LatLng {
  name?: string;
}

interface LocationWithSetter {
  currentLocation?: Location;
  setLatLng: (latlng?: LatLng) => void;
}

export const GpsLocationContext = createContext<Location | undefined>(
  DEFAULT_LAT_LNG
);
export const CurrentLocationContext = createContext<LocationWithSetter>({
  ...DEFAULT_LAT_LNG,
  setLatLng: noop
});

function fetchGpsPosition() {
  return TE.tryCatch(
    async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      console.log('<LocationContext> - fetchGpsPosition - Fetching location');
      return ExpoLocation.getCurrentPositionAsync({
        timeout: 5000
      });
      // Uncomment to get other locations
      // const coords = {
      //   latitude: Math.random() * 90,
      //   longitude: Math.random() * 90
      // };
      // const coords = {
      //   latitude: 48.4,
      //   longitude: 2.34
      // };
    },
    err => new Error(String(err))
  );
}

export function LocationContextProvider({
  children
}: {
  children: JSX.Element;
}) {
  const { setError } = useContext(ErrorContext);

  const [gpsLocation, setGpsLocation] = useState<Location | undefined>();
  const [currentLocation, setCurrentLocation] = useState<Location | Location>();

  // Fetch GPS location
  useEffect(() => {
    TE.fold<Error, ExpoLocation.LocationData, undefined>(
      err => {
        console.log('<LocationContext> - fetchGpsPosition - Error', err);
        setError(err.message);

        return T.of(undefined);
      },
      ({ coords }) => {
        console.log(
          '<LocationContext> - fetchGpsPosition - Got location',
          coords
        );
        setGpsLocation(coords);
        setCurrentLocation(coords);

        return T.of(undefined);
      }
    )(fetchGpsPosition())();
  }, []);

  return (
    <GpsLocationContext.Provider value={gpsLocation}>
      <CurrentLocationContext.Provider
        value={{ currentLocation, setLatLng: setCurrentLocation }}
      >
        {children}
      </CurrentLocationContext.Provider>
    </GpsLocationContext.Provider>
  );
}
