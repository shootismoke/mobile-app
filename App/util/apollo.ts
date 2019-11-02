import {
  historyItemSchema,
  stationSchema,
  userSchema
} from '@shootismoke/graphql/lib/schema';
import ApolloClient from 'apollo-boost';
import Constants from 'expo-constants';

const BACKEND_URI =
  Constants.manifest.releaseChannel === 'production'
    ? 'https://shootismoke.now.sh/api/graphql'
    : 'https://staging.shootismoke.now.sh/api/graphql';

/**
 * The Apollo client
 * TODO Copy this from @shootismoke/graphql
 */
export const client = new ApolloClient({
  typeDefs: [historyItemSchema, stationSchema, userSchema],
  uri: BACKEND_URI
});
