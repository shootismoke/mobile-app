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
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, Text, View } from 'react-native';

import { Button } from '../../../components';
import {
  AqiHistoryDbItem,
  clearTable,
  getData,
  populateRandom
} from '../../../managers/AqiHistoryDb';
import {
  AQI_HISTORY_LAST_FETCH_ATTEMPT,
  AQI_HISTORY_LAST_FETCH_RESULT
} from '../../../managers/AqiHistoryTask';
import { getLastKnownGps, GPS_TASK } from '../../../managers/GpsTask';
import * as theme from '../../../util/theme';

export function Dev () {
  const [allData, setAllData] = useState<AqiHistoryDbItem[]>([]);
  const [
    aqiHistoryTask,
    setAqiHistoryTask
  ] = useState<BackgroundFetch.Status | null>(null);
  const [bgLocation, setBgLocation] = useState(false);
  const [startedBgLocation, setStartedBgLocation] = useState(false);
  const [asyncStorageGps, setAsyncStorageGps] = useState();
  const [lastBgFetchAttempt, setLastBgFetchAttempt] = useState();
  const [lastBgFetchResult, setLastBgFetchResult] = useState();

  useEffect(() => {
    // Data in SQL db
    const oneWeekAgo = new Date();
    oneWeekAgo.setHours(oneWeekAgo.getHours() - 24 * 7);
    pipe(
      getData(oneWeekAgo),
      TE.fold(
        err => {
          console.log(`<Dev> - getData - Error ${err.message}`);

          return T.of(undefined);
        },
        data => {
          setAllData(data);
          return T.of(undefined);
        }
      )
    )();

    // GPS_TASK status
    ExpoLocation.isBackgroundLocationAvailableAsync().then(setBgLocation);
    ExpoLocation.hasStartedLocationUpdatesAsync(GPS_TASK).then(
      setStartedBgLocation
    );
    pipe(
      getLastKnownGps(),
      TE.fold(
        err => {
          console.log(`<Dev> - getLastKnownGps - Error ${err.message}`);

          return T.of(undefined);
        },
        data => {
          setAsyncStorageGps(data);
          return T.of(undefined);
        }
      )
    )();

    // AQI_HISTORY_TASK status
    BackgroundFetch.getStatusAsync().then(setAqiHistoryTask);
    AsyncStorage.getItem(AQI_HISTORY_LAST_FETCH_ATTEMPT).then(
      setLastBgFetchAttempt
    );
    AsyncStorage.getItem(AQI_HISTORY_LAST_FETCH_RESULT).then(
      setLastBgFetchResult
    );
  }, []);

  return (
    <View>
      <Text style={theme.text}>
        BackgroundFetch status:{' '}
        {aqiHistoryTask && BackgroundFetch.Status[aqiHistoryTask]}
      </Text>
      <Text style={theme.text}>
        isBackgroundLocationAvailableAsync: {bgLocation.toString()}
      </Text>
      <Text style={theme.text}>
        hasStartedLocationUpdatesAsync: {startedBgLocation.toString()}
      </Text>
      <Text style={theme.text}>
        Last known GPS: {JSON.stringify(asyncStorageGps)}
      </Text>
      <Text style={theme.text}>Last BackgroundFetch: {lastBgFetchAttempt}</Text>
      <Text style={theme.text}>
        Last BackgroundFetch Result: {lastBgFetchResult}
      </Text>
      <Text style={theme.text}>
        All DB:{' '}
        {JSON.stringify(allData.map(({ creationTime }) => creationTime))}
      </Text>
      <Button onPress={() => populateRandom()()}>Populate Random Data</Button>
      <Button onPress={() => clearTable()()}>Clear DB</Button>
    </View>
  );
}
