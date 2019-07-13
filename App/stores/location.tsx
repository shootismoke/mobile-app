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

import * as BackgroundFetch from 'expo-background-fetch';
import * as ExpoLocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import { isTaskRegisteredAsync } from 'expo-task-manager';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ErrorContext } from './error';
import { SAVE_DATA_INTERVAL } from '../managers/AqiHistoryDb';
import { AQI_HISTORY_TASK } from '../managers/AqiHistoryTask';
import { GPS_TASK } from '../managers/GpsTask';
import { toError } from '../util/fp';
import { noop } from '../util/noop';

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

function fetchGpsPosition () {
  return TE.tryCatch(async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    console.log('<LocationContext> - fetchGpsPosition - Fetching location');

    // Start the task to record periodically on the background the location
    const isGpsRegistered = await isTaskRegisteredAsync(GPS_TASK);
    if (!isGpsRegistered) {
      ExpoLocation.startLocationUpdatesAsync(GPS_TASK);
    }
    // Start the task to record periodically on the background the location
    const isAqiRegistered = await isTaskRegisteredAsync(AQI_HISTORY_TASK);
    if (!isAqiRegistered) {
      BackgroundFetch.registerTaskAsync(AQI_HISTORY_TASK, {
        minimumInterval: SAVE_DATA_INTERVAL, // in s
        startOnBoot: true,
        stopOnTerminate: true
      });
    }

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
  }, toError);
}

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
      TE.fold(
        err => {
          console.log('<LocationContext> - fetchGpsPosition - Error', err);
          setError(err.message);

          return T.of(undefined);
        },
        ({ coords }) => {
          console.log(
            `<LocationContext> - fetchGpsPosition - Got location ${JSON.stringify(
              coords
            )}`
          );
          setGpsLocation(coords);
          setCurrentLocation(coords);

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