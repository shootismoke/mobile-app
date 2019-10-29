import ApolloClient, { gql } from 'apollo-boost';
import Constants from 'expo-constants';

const BACKEND_URI =
  Constants.manifest.releaseChannel === 'production'
    ? 'https://google.com'
    : 'https://backend-ldd9karvq.now.sh/api/graphql';

/**
 * The Apollo client
 */
export const client = new ApolloClient({
  typeDefs: gql`
    enum Notifications {
      never
      daily
      weekly
      monthly
    }

    input CreateUserInput {
      expoInstallationId: String!
      expoPushToken: String
      notifications: Notifications
    }
  `,
  uri: BACKEND_URI
});
