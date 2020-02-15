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

import Hawk from '@hapi/hawk/lib/browser';
import NetInfo from '@react-native-community/netinfo';
import { userSchema } from '@shootismoke/graphql';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { ErrorResponse, onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';
import Constants from 'expo-constants';
import {
  ApolloOfflineClient,
  NetworkStatus,
  PersistedData
} from 'offix-client';
import { AsyncStorage } from 'react-native';

import { IS_PROD, RELEASE_CHANNEL } from '../util/constants';
import { sentryError } from './sentry';

const BACKEND_URI = IS_PROD
  ? 'https://shootismoke.now.sh/api/graphql'
  : 'https://staging.shootismoke.now.sh/api/graphql';

// Hawk credentials
const credentials = {
  id: `${Constants.manifest.slug}-${RELEASE_CHANNEL}`,
  key: Constants.manifest.extra.hawkKey,
  algorithm: 'sha256'
};

// Create cache wrapper
const cacheStorage = {
  async getItem(key: string): Promise<PersistedData> {
    const data = await AsyncStorage.getItem(key);
    if (typeof data === 'string') {
      return JSON.parse(data);
    }

    return data;
  },
  async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  },
  async setItem(key: string, value: PersistedData): Promise<void> {
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : value;

    return AsyncStorage.setItem(key, valueStr);
  }
};

// Create network interface
const networkStatus: NetworkStatus = {
  onStatusChangeListener(callback) {
    NetInfo.addEventListener(state =>
      callback.onStatusChange({ online: state.isConnected })
    );
  },
  async isOffline() {
    const state = await NetInfo.fetch();

    return !state.isConnected;
  }
};

/**
 * The Apollo client
 */
export const client = new ApolloOfflineClient({
  cache: new InMemoryCache(),
  cacheStorage,
  link: ApolloLink.from([
    // Add Hawk authentication in header
    setContext(() => {
      // Set Hawk authorization header on each request
      const { header } = Hawk.client.header(BACKEND_URI, 'POST', {
        credentials
      });

      return {
        headers: {
          authorization: header
        }
      };
    }),
    // Error handling
    onError(({ graphQLErrors, networkError }: ErrorResponse): void => {
      // Send errors to Sentry
      if (networkError) {
        sentryError('Apollo')(networkError);
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(sentryError('Apollo'));
      }
    }),
    // Classic HTTP link
    createHttpLink({ uri: BACKEND_URI })
  ]),
  offlineStorage: cacheStorage,
  networkStatus,
  typeDefs: [userSchema]
});
