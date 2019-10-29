import ApolloClient from 'apollo-boost';
import Constants from 'expo-constants';

const BACKEND_URI =
  Constants.manifest.releaseChannel === 'production'
    ? 'https://google.com'
    : 'https://backend-ldd9karvq.now.sh/';

export const client = new ApolloClient({
  uri: BACKEND_URI
});
