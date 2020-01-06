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

import { Frequency, UpdateUserInput } from '@shootismoke/graphql';
import { gql } from 'apollo-boost';
import * as C from 'fp-ts/lib/Console';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { client } from '../../util/apollo';
import { promiseToTE, sideEffect } from '../../util/fp';
import { getOrCreateUser } from './createUser';

const UPDATE_USER = gql`
  mutation updateUser($userId: ID!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      _id
    }
  }
`;

/**
 * Update notification setting
 */
export function updateNotifications(
  frequency: Frequency
): TE.TaskEither<Error, true> {
  return pipe(
    getOrCreateUser(),
    TE.map<string, { userId: string; input: UpdateUserInput }>(userId => ({
      userId,
      input: {
        notifications: {
          frequency
        }
      }
    })),
    TE.chain(
      sideEffect(({ input }) =>
        TE.rightIO(C.log(`<updateUser> - ${JSON.stringify(input)}`))
      )
    ),
    TE.chain(data =>
      promiseToTE(async () =>
        client.mutate({
          mutation: UPDATE_USER,
          variables: data
        })
      )
    ),
    TE.map(() => true)
  );
}
