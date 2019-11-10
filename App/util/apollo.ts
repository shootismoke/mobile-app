import {
  historyItemSchema,
  stationSchema,
  userSchema
} from '@shootismoke/graphql';
import ApolloClient from 'apollo-boost';
import Constants from 'expo-constants';

const BACKEND_URI =
  Constants.manifest.releaseChannel ===
  `production-v${Constants.manifest.version}`
    ? 'https://shootismoke.now.sh/api/graphql'
    : 'https://staging.shootismoke.now.sh/api/graphql';

/**
 * The Apollo client
 */
export const client = new ApolloClient({
  typeDefs: [historyItemSchema, stationSchema, userSchema],
  uri: BACKEND_URI
});
