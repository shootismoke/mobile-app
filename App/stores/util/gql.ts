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

import { useMutation, useQuery } from '@apollo/client';
import {
  gql,
  MutationResult,
  MutationTuple,
  QueryResult,
} from '@apollo/client';
import {
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  QueryGetUserArgs,
  User,
} from '@shootismoke/graphql';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

import { sentryError } from '../../util/sentry';
import { HAWK_STALE_TIMESTAMP } from './hawk';

/**
 * Partial<T>, but deep recursive.
 *
 * https://gist.github.com/navix/6c25c15e0a2d3cd0e5bce999e0086fc9
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

const GET_USER = gql`
  query getUser($expoInstallationId: ID!) {
    __typename
    getUser(expoInstallationId: $expoInstallationId) {
      __typename
      _id
      notifications {
        __typename
        _id
        frequency
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    __typename
    createUser(input: $input) {
      __typename
      _id
      notifications {
        __typename
        _id
        frequency
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($expoInstallationId: ID!, $input: UpdateUserInput!) {
    __typename
    updateUser(expoInstallationId: $expoInstallationId, input: $input) {
      __typename
      _id
      notifications {
        __typename
        _id
        frequency
      }
    }
  }
`;

/**
 * Options for the `getUser` graphql query
 */
export const USER_VARIABLES = {
  expoInstallationId: Constants.installationId,
};

/**
 * Hook to fetch user from backend, or create it if not existing. Also handles
 * refetching if hawk timestamp is stale.
 */
export function useGetOrCreateUser(): {
  createUser: MutationResult<{
    createUser: DeepPartial<User>;
  }>;
  getUser: QueryResult<
    {
      getUser: DeepPartial<User> | null;
    },
    QueryGetUserArgs
  >;
} {
  const getUser = useQuery<
    { getUser: DeepPartial<User> | null },
    QueryGetUserArgs
  >(GET_USER, {
    fetchPolicy: 'cache-and-network' as const,
    variables: USER_VARIABLES,
  });
  const [createUser, createUserData] = useMutation<
    { createUser: DeepPartial<User> },
    MutationCreateUserArgs
  >(CREATE_USER, {
    variables: { input: USER_VARIABLES },
  });

  // The number of times we refetched.
  const [refetchCount, setRefetchCount] = useState(0);

  // Create a new user if user does not exist on backend
  useEffect(() => {
    if (getUser.loading === false && getUser.data?.getUser === null) {
      createUser({
        variables: { input: USER_VARIABLES },
      }).catch(sentryError('SelectNotifications'));
    }
  }, [createUser, getUser.data, getUser.loading]);

  // Refetch on "Stale timestamp" hawk error
  // FIXME this seems hacky, we should manage refetches from "Stale timestamp"
  // globally. Maybe something like:
  // https://github.com/apollographql/apollo-link/issues/541.
  useEffect(() => {
    // We also only refetch once
    if (getUser.error?.message === HAWK_STALE_TIMESTAMP && refetchCount === 0) {
      setRefetchCount(refetchCount + 1);
      // Wait 500ms, because on "Stale timestamp" error, we do a Hawk
      // authenticateTimestampe to calibrate offset.
      setTimeout(() => {
        getUser.refetch(USER_VARIABLES);
      }, 500);
    }
  }, [getUser, refetchCount]);

  return { createUser: createUserData, getUser };
}

export function useUpdateUser(): MutationTuple<
  {
    updateUser: DeepPartial<User>;
  },
  MutationUpdateUserArgs
> {
  return useMutation<{ updateUser: DeepPartial<User> }, MutationUpdateUserArgs>(
    UPDATE_USER
  );
}
