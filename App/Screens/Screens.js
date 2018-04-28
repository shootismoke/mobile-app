import React, { Component } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import { Constants } from 'expo';
import retry from 'async-retry';

import ErrorScreen from './ErrorScreen';
import getCurrentPosition from '../utils/getCurrentPosition';
import Home from './Home';
import Loading from './Loading';
import Map from './Map';
import pm25ToCigarettes from '../utils/pm25ToCigarettes';
import Search from './Search';
import * as theme from '../utils/theme';

// We manage navigation ourselves for this simple app
const PAGES = {
  ERROR: 'ERROR', // The error page
  HOME: 'HOME', // The homepage with the cigarettes
  MAP: 'MAP' // The map page with the station pin
  // SEARCH: 'SEARCH' // The search page is a modal, so does not go here
};

export default class Screens extends Component {
  state = {
    api: null,
    gps: null,
    isSearchVisible: false,
    page: PAGES.HOME
  };

  componentDidCatch() {
    this.setState({ page: ERROR });
  }

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.setState({ api: null, gps: null });
      const { coords } = await getCurrentPosition();
      this.setState({ gps: coords });
      await retry(
        async () => {
          const { data: response } = await axios.get(
            `http://api.waqi.info/feed/geo:${coords.latitude};${
              coords.longitude
            }/?token=${Constants.manifest.extra.waqiToken}`,
            { timeout: 6000 }
          );

          if (response.status === 'ok') {
            this.setState({ api: response.data });
          } else {
            throw new Error(response.data);
          }
        },
        { retries: 2 }
      );
    } catch (err) {
      Alert.alert('Sh*t, an error!', `The error message is: ${err.message}`, [
        { text: 'Retry', onPress: () => this.fetchData() }
      ]);
    }
  }

  goToHome = () => this.setState({ page: PAGES.HOME });

  goToMap = () => this.setState({ page: PAGES.MAP });

  handleSearchHide = () => this.setState({ isSearchVisible: false });

  handleSearchShow = () => this.setState({ isSearchVisible: true });

  render() {
    const { api, gps, isSearchVisible, page } = this.state;

    if (!api) {
      return <Loading api={api} gps={gps} />;
    }

    switch (page) {
      case PAGES.HOME:
        return <Home api={api} gps={gps} />;
      case PAGES.MAP:
        return (
          <Map
            api={api}
            gps={gps}
            onClose={this.goToHome}
            station={{
              description: api.attributions.length
                ? api.attributions[0].name
                : null,
              latitude: api.city.geo[0],
              longitude: api.city.geo[1],
              title: api.city.name
            }}
          />
        );
      default:
        return <ErrorScreen />;
    }
  }
}

const styles = StyleSheet.create({
  cigarettesCount: {
    color: theme.primaryColor
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dots: {
    color: theme.primaryColor
  },
  main: {
    height: 220 // Empiric
  },
  share: {
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: '90%'
  },
  shareText: {
    ...theme.title,
    color: 'white',
    ...Platform.select({
      android: {
        fontSize: 15
      },
      ios: {
        fontSize: 12
      }
    })
  },
  shit: {
    ...theme.shitText,
    marginTop: 23
  }
});
