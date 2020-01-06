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

import { ApolloProvider } from '@apollo/react-hooks';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import * as Sentry from 'sentry-expo';

import { Screens } from './Screens';
import { Background as LoadingBackground } from './Screens/Loading/Background';
import {
  ApiContextProvider,
  DistanceUnitProvider,
  ErrorContextProvider,
  FrequencyContextProvider,
  LocationContextProvider
} from './stores';
import { setupAmplitude, track } from './util/amplitude';
import { client } from './util/apollo';

// Add Sentry if available
if (Constants.manifest.extra.sentryPublicDsn) {
  Sentry.init({
    dsn: Constants.manifest.extra.sentryPublicDsn,
    debug: true
  });

  if (Constants.manifest.revisionId) {
    Sentry.setRelease(Constants.manifest.revisionId);
  }
}

export function App(): React.ReactElement {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      Font.loadAsync({
        'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
        'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
      }),
      // Add Amplitude if available
      setupAmplitude()
    ])

      .then(() => setReady(true))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        track('APP_REFOCUS');
      } else if (state === 'background') {
        track('APP_EXIT');
      }
    });
  }, []);

  return ready ? (
    <ErrorContextProvider>
      <LocationContextProvider>
        <ApolloProvider client={client}>
          <ApiContextProvider>
            <FrequencyContextProvider>
              <DistanceUnitProvider>
                {Platform.select({
                  ios: <StatusBar barStyle="dark-content" />
                })}
                <Screens />
              </DistanceUnitProvider>
            </FrequencyContextProvider>
          </ApiContextProvider>
        </ApolloProvider>
      </LocationContextProvider>
    </ErrorContextProvider>
  ) : (
    <LoadingBackground />
  );
}
