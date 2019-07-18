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

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ErrorContext } from './error';
import {
  fetchGpsPosition,
  fetchReverseGeocode,
  LatLng,
  Location
} from './fetchGpsPosition';
import { noop } from '../util/noop';

const DEFAULT_LAT_LNG: LatLng = {
  latitude: 0,
  longitude: 0
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
  setCurrentLocation: noop
});

export function LocationContextProvider ({
  children
}: {
  children: JSX.Element;
}) {
  const { setError } = useContext(ErrorContext);

  const [gpsLocation, setGpsLocation] = useState<Location>();
  const [currentLocation, setCurrentLocation] = useState<Location>();

  // Fetch GPS location
  useEffect(() => {
    pipe(
      fetchGpsPosition(),
      TE.map(({ coords }) => coords),
      TE.chain(gps =>
        TE.rightTask(
          pipe(
            fetchReverseGeocode(gps),
            TE.fold(() => T.of(gps as Location), T.of)
          )
        )
      ),
      TE.fold(
        err => {
          console.log('<LocationContext> - fetchGpsPosition - Error', err);
          setError(err.message);

          return T.of(undefined);
        },
        gps => {
          console.log(
            `<LocationContext> - fetchGpsPosition - Got location ${JSON.stringify(
              gps
            )}`
          );
          setGpsLocation(gps);
          setCurrentLocation(gps);

          return T.of(undefined);
        }
      )
    )();
  }, []);

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
          setCurrentLocation
        }}
      >
        {children}
      </CurrentLocationContext.Provider>
    </GpsLocationContext.Provider>
  );
}
