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

import { CreateUserInput } from '@shootismoke/graphql';
import { gql } from 'apollo-boost';
import Constants from 'expo-constants';
import * as TE from 'fp-ts/lib/TaskEither';
import { AsyncStorage } from 'react-native';

import { client } from '../../util/apollo';
import { promiseToTE } from '../../util/fp';

const STORAGE_KEY = 'MONGO_ID';

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
    }
  }
`;

// The mongo id of the user, stored here in memory, but also in AsyncStorage
let cachedMongoId: string | undefined;

/**
 * Get or create a user
 */
export function getOrCreateUser(): TE.TaskEither<Error, string> {
  return promiseToTE(async () => {
    if (cachedMongoId) {
      return cachedMongoId;
    }

    let mongoId = await AsyncStorage.getItem(STORAGE_KEY);
    if (!mongoId) {
      const input: CreateUserInput = {
        expoInstallationId: Constants.installationId
      };
      console.log(
        `<createUser> - No mongoId found in AsyncStorage, creating a new user ${JSON.stringify(
          input
        )}`
      );

      const res = await client.mutate({
        mutation: CREATE_USER,
        variables: { input }
      });

      mongoId = res.data.createUser._id as string;

      await AsyncStorage.setItem(STORAGE_KEY, mongoId);
    }

    // eslint-disable-next-line require-atomic-updates
    cachedMongoId = mongoId;

    return mongoId;
  });
}
