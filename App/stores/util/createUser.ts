import { gql } from 'apollo-boost';
import Constants from 'expo-constants';
import * as TE from 'fp-ts/lib/TaskEither';
import { AsyncStorage } from 'react-native';

import { client } from '../../util/apollo';
import { toError } from '../../util/fp';

const STORAGE_KEY = 'MONGO_ID';

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
    }
  }
`;

export function getOrCreateUser() {
  return TE.tryCatch(async () => {
    let mongoId = await AsyncStorage.getItem(STORAGE_KEY);
    if (!mongoId) {
      const res = await client.mutate({
        mutation: CREATE_USER,
        variables: {
          input: { expoInstallationId: Constants.installationId }
        }
      });

      mongoId = res.data._id as string;
    }

    return mongoId;
  }, toError);
}
