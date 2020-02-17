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

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
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
import { getApolloClient, TCacheShape } from './util/apollo';
import { IS_SENTRY_SET_UP, RELEASE_CHANNEL } from './util/constants';
import { sentryError } from './util/sentry';

// Add Sentry if available
if (IS_SENTRY_SET_UP) {
  Sentry.init({
    dsn: Constants.manifest.extra.sentryPublicDsn,
    debug: true
  });

  Sentry.setRelease(RELEASE_CHANNEL);
  if (Constants.manifest.revisionId) {
    Sentry.setExtra('sisRevisionId', Constants.manifest.revisionId);
  }
}

export function App(): React.ReactElement {
  const [ready, setReady] = useState(false);
  const [client, setClient] = useState<ApolloClient<TCacheShape>>();

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
      .catch(sentryError('App'));
  }, []);

  useEffect(() => {
    // Load the Offix client
    getApolloClient()
      .then(setClient)
      .catch(sentryError('App'));
  }, []);

  useEffect(() => {
    // Track user closing/re-opening the app
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        track('APP_REFOCUS');
      } else if (state === 'background') {
        track('APP_EXIT');
      }
    });
  }, []);

  return (
    <ErrorContextProvider>
      <LocationContextProvider>
        <ActionSheetProvider>
          <ApiContextProvider>
            <FrequencyContextProvider>
              <DistanceUnitProvider>
                {ready && client ? (
                  <ApolloProvider client={client}>
                    <Screens />
                  </ApolloProvider>
                ) : (
                  <LoadingBackground />
                )}
                {Platform.select({
                  ios: <StatusBar barStyle="dark-content" />
                })}
              </DistanceUnitProvider>
            </FrequencyContextProvider>
          </ApiContextProvider>
        </ActionSheetProvider>
      </LocationContextProvider>
    </ErrorContextProvider>
  );
}
