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

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Background } from './Background';

import { i18n } from '../../localization';
import { Api, ApiContext, GpsLocationContext, Location } from '../../stores';
import * as theme from '../../utils/theme';

// The variable returned by setTimeout for longWaiting
let longWaitingTimeout: NodeJS.Timeout | null = null;

export function Loading() {
  const api = useContext(ApiContext);
  const gps = useContext(GpsLocationContext);

  const [longWaiting, setLongWaiting] = useState(false); // If api is taking a long time

  useEffect(() => {
    // Set a 2s timer that will set `longWaiting` to true. Used to show an
    // additional "cough" message on the loading screen
    longWaitingTimeout = setTimeout(() => {
      console.log('<Loading> - Long waiting');
      setLongWaiting(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (api && longWaitingTimeout) {
      clearTimeout(longWaitingTimeout);
      longWaitingTimeout = null;
    }
  }, [api]);

  return (
    <Background style={theme.withPadding}>
      <Text style={styles.text}>{renderText(longWaiting, gps, api)}</Text>
    </Background>
  );
}

function renderCough(index: number) {
  return (
    <Text key={index}>
      {i18n.t('loading_title_cough')}
      <Text style={styles.dots}>...</Text>
    </Text>
  );
}

function renderText(longWaiting: boolean, gps?: Location, api?: Api) {
  let coughs = 0; // Number of times to show "Cough..."
  if (gps) ++coughs;
  if (longWaiting) ++coughs;
  if (api) ++coughs;

  return (
    <Text>
      {i18n.t('loading_title_loading')}
      <Text style={styles.dots}>...</Text>
      {Array.from({ length: coughs }, (_, index) => index + 1).map(
        // Create array 1..N and rendering Cough...
        renderCough
      )}
    </Text>
  );
}

// TaskManager.defineTask(TASK_STORE_AQI_HISTORY, async ({ data, error }) => {
//   if (error) {
//     console.log('<Loading> - TaskManager - defineTask - Error', error.message);
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     const { coords } = locations[0];

//     // We currently have 2 sources, aqicn, and windWaqi
//     // We put them in an array
//     const sources = [dataSources.aqicn, dataSources.windWaqi];

//     const api = await retry(
//       async (_, attempt) => {
//         // Attempt starts at 1
//         console.log(
//           `<Loading> - fetchData - Attempt #${attempt}: ${
//             sources[(attempt - 1) % 2].name
//           }`
//         );
//         const result = await sources[(attempt - 1) % 2](coords);
//         console.log('<Loading> - fetchData - Got result', result);

//         return result;
//       },
//       { retries: 3 } // 2 attempts per source
//     );

//     if (await AqiHistoryDb.isSaveNeeded()) {
//       await AqiHistoryDb.saveData(api.city.name, api.rawPm25, coords);
//     }
//   }

const styles = StyleSheet.create({
  dots: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
