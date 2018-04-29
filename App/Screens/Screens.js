import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import retry from 'async-retry';
import { StackNavigator } from 'react-navigation';
import { Alert, StyleSheet, View } from 'react-native';

import ErrorScreen from './ErrorScreen';
import getCurrentPosition from '../utils/getCurrentPosition';
import Header from '../Header';
import Home from './Home';
import Loading from './Loading';
import MapScreen from './MapScreen';
import Search from './Search';
import * as theme from '../utils/theme';

const RootStack = StackNavigator(
  {
    Error: {
      screen: ErrorScreen
    },
    Home: {
      screen: Home
    },
    Map: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      },
      headerTintColor: 'white',
      headerTransparent: true
    }
  }
);

export default class Screens extends Component {
  state = {
    api: null,
    currentLocation: null, // Initialized to GPS, but can be changed by user
    gps: null,
    isSearchVisible: false
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    const { currentLocation } = this.state;
    try {
      this.setState({ api: null });

      // If the currentLocation has been set by the user, then we don't refetch
      // the user's GPS
      let coords;
      if (!currentLocation) {
        const response = await getCurrentPosition();
        coords = response.coords;
        this.setState({ currentLocation: coords, gps: coords });
      }

      await retry(
        async () => {
          const { data: response } = await axios.get(
            `http://api.waqi.info/feed/geo:${
              (currentLocation || coords).latitude
            };${(currentLocation || coords).longitude}/?token=${
              Constants.manifest.extra.waqiToken
            }`,
            { timeout: 6000 }
          );

          if (response.status === 'ok') {
            this.setState({ api: response.data });
          } else {
            throw new Error(response.data);
          }
        },
        { retries: 3 }
      );
    } catch (err) {
      Alert.alert('Sh*t, an error!', `The error message is: ${err.message}`, [
        { text: 'Retry', onPress: () => this.fetchData() }
      ]);
    }
  }

  handleChangeLocation = currentLocation => {
    this.setState({ currentLocation, isSearchVisible: false }, this.fetchData);
  };

  handleSearchHide = () => this.setState({ isSearchVisible: false });

  handleSearchShow = () => this.setState({ isSearchVisible: true });

  render() {
    const { api, currentLocation, gps, isSearchVisible } = this.state;

    if (!api || !currentLocation) {
      return <Loading gps={gps} />;
    }

    return (
      <View style={theme.fullScreen}>
        <RootStack
          screenProps={{
            api,
            currentLocation,
            gps,
            onChangeLocationClick: this.handleSearchShow
          }}
        />
        <Search
          gps={gps}
          onChangeLocation={this.handleChangeLocation}
          onRequestClose={this.handleSearchHide}
          visible={isSearchVisible}
        />
      </View>
    );
  }
}
