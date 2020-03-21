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
import { userSchema } from '@shootismoke/graphql';
import { persistCache } from 'apollo-cache-persist';
import Constants from 'expo-constants';
import { AsyncStorage } from 'react-native';

import { IS_PROD } from '../util/constants';
import { sentryError } from '../util/sentry';
import {
  credentials,
  handleStaleTimestamp,
  HAWK_STALE_TIMESTAMP,
  hawkFetch
} from './util';

const BACKEND_URI = IS_PROD
  ? 'https://shootismoke.now.sh/api/graphql'
  : 'https://staging.shootismoke.now.sh/api/graphql';

// FIXME Which type should this have?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCacheShape = any;

// Cache Apollo client
let _client: ApolloClient<TCacheShape>;

/**
 * When we get errors from Apollo, we log them on Sentry, or do something else
 * with them.
 */
function handleApolloError({
  graphQLErrors,
  networkError
}: ErrorResponse): void {
  // Send errors to Sentry
  if (networkError) {
    sentryError('Apollo')(
      new Error(`[${networkError.name}]: ${networkError.message}`)
    );
  }

  if (graphQLErrors) {
    // If we find a `Stale timestamp` error from hawk, we handle that
    // separately. We would need to adjust the local timestamp offset.
    const staleTimestampError = graphQLErrors.find(
      ({ message }) => message === HAWK_STALE_TIMESTAMP
    );
    if (staleTimestampError) {
      handleStaleTimestamp(staleTimestampError, credentials);
    }

    graphQLErrors
      .filter(({ message }) => message !== HAWK_STALE_TIMESTAMP)
      .forEach(({ message, name }) =>
        sentryError('Apollo')(new Error(`[${name}]: ${message}`))
      );
  }
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
      onError(handleApolloError),
      // Retry on error
      new RetryLink(),
      // Classic HTTP link
      createHttpLink({ fetch: hawkFetch(BACKEND_URI), uri: BACKEND_URI })
    ]),
    name: 'shootismoke-expo',
    typeDefs: [userSchema],
    version: `v${Constants.manifest.version}`
  });

  _client = client;

  return client;
}
