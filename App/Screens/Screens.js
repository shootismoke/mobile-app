import React, { Component } from 'react';
import axios from 'axios';
import { Constants, Video } from 'expo';
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
import smokeVideo from '../../assets/video/smoke.mp4';
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
    cardStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0
    },
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0
      },
      headerTransparent: true
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent'
      }
    })
  }
);

export default class Screens extends Component {
  state = {
    api: null,
    currentLocation: null, // Initialized to GPS, but can be changed by user
    error: null, // Error here or in children component tree
    gps: null,
    isSearchVisible: false
  };

  componentWillMount() {
    this.fetchData();
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  async fetchData() {
    const { currentLocation } = this.state;
    try {
      this.setState({ api: null, error: null });

      // If the currentLocation has been set by the user, then we don't refetch
      // the user's GPS
      let coords;
      if (!currentLocation) {
        const response = await getCurrentPosition();
        coords = response.coords;
        this.setState({ currentLocation: coords, gps: coords });
      }

      // Un comment to get random data stations
      // coords = { latitude: Math.random() * 90, longitude: Math.random() * 90 };

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
    } catch (error) {
      this.setState({ error });
    }
  }

  handleLocationChanged = currentLocation => {
    this.setState({ currentLocation, isSearchVisible: false }, this.fetchData);
  };

  handleSearchHide = () => this.setState({ isSearchVisible: false });

  handleSearchShow = () => this.setState({ isSearchVisible: true });

  render() {
    const { gps, isSearchVisible } = this.state;
    return (
      <View style={styles.container}>
        {this.renderScreen()}
        <Search
          gps={gps}
          onLocationChanged={this.handleLocationChanged}
          onRequestClose={this.handleSearchHide}
          visible={isSearchVisible}
        />
      </View>
    );
  }

  renderScreen = () => {
    const { api, currentLocation, error, gps } = this.state;

    if (error) {
      return (
        <ErrorScreen gps={gps} onChangeLocationClick={this.handleSearchShow} />
      );
    }

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
        {/* <Video
      resizeMode="cover"
      shouldPlay
      source={smokeVideo}
      style={{
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: -1
      }}
    /> */}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
});
