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
import { userSchema } from '@shootismoke/graphql';
import ApolloClient from 'apollo-boost';
import { ErrorResponse } from 'apollo-link-error';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

import { IS_PROD, RELEASE_CHANNEL } from '../util/constants';

const BACKEND_URI = IS_PROD
  ? 'https://shootismoke.now.sh/api/graphql'
  : 'https://staging.shootismoke.now.sh/api/graphql';

const credentials = {
  id: `${Constants.manifest.slug}-${RELEASE_CHANNEL}`,
  key: Constants.manifest.extra.hawkKey,
  algorithm: 'sha256'
};

/**
 * The Apollo client
 */
export const client = new ApolloClient({
  onError: ({ graphQLErrors, networkError }: ErrorResponse): void => {
    // Send errors to Sentry
    if (networkError) {
      Sentry.captureException(networkError);
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(error => Sentry.captureException(error));
    }
  },
  request: (operation): void => {
    // Set Hawk authorization header on each request
    const { header } = Hawk.client.header(BACKEND_URI, 'POST', { credentials });

    operation.setContext({
      headers: {
        authorization: header
      }
    });
  },
  typeDefs: [userSchema],
  uri: BACKEND_URI
});
