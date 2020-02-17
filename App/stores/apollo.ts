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

import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache
} from '@apollo/client';
import { ErrorResponse, onError } from '@apollo/link-error';
import { RetryLink } from '@apollo/link-retry';
import Hawk from '@hapi/hawk/lib/browser';
import { userSchema } from '@shootismoke/graphql';
import { persistCache } from 'apollo-cache-persist';
import Constants from 'expo-constants';
import { AsyncStorage } from 'react-native';

import { IS_PROD, RELEASE_CHANNEL } from '../util/constants';
import { sentryError } from '../util/sentry';

const BACKEND_URI = IS_PROD
  ? 'https://shootismoke.now.sh/api/graphql'
  : 'https://staging.shootismoke.now.sh/api/graphql';

// Hawk credentials
const credentials = {
  id: `${Constants.manifest.slug}-${RELEASE_CHANNEL}`,
  key: Constants.manifest.extra.hawkKey,
  algorithm: 'sha256'
};

// FIXME Which type should this have?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCacheShape = any;

// Cache Apollo client
let _client: ApolloClient<TCacheShape>;

/**
 * Custom fetch for Hawk. Like `fetch`, but adds Hawk authentication on each
 * network call.
 *
 * @see https://www.apollographql.com/docs/react/v3.0-beta/networking/advanced-http-networking/#custom-fetching
 */
function hawkFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  // Set Hawk authorization header on each request
  const { header } = Hawk.client.header(BACKEND_URI, 'POST', {
    credentials
  });

  return fetch(input, {
    ...init,
    headers: { authorization: header, ...init.headers }
  });
}

/**
 * Create an Apollo client.
 */
export async function getApolloClient(): Promise<ApolloClient<TCacheShape>> {
  if (_client) {
    return _client;
  }

  const cache = new InMemoryCache();

  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await persistCache({
    cache,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore FIXME, I don't know how to fix here
    storage: AsyncStorage
  });

  const client = new ApolloClient({
    cache,
    link: from([
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
      // Retry on error
      new RetryLink(),
      // Classic HTTP link
      createHttpLink({ fetch: hawkFetch, uri: BACKEND_URI })
    ]),
    typeDefs: [userSchema]
  });

  _client = client;

  return client;
}
