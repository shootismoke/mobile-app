// Copyright (c) 2018, Amaury Martiny and the Sh*t! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants, Video } from 'expo';
import { Dimensions, StyleSheet, View } from 'react-native';
import retry from 'async-retry';
import { StackNavigator } from 'react-navigation';

import ErrorScreen from './ErrorScreen';
import getCurrentPosition from '../utils/getCurrentPosition';
import Header from '../Header';
import Home from './Home';
import Loading from './Loading';
import MapScreen from './MapScreen';
import pm25ToCigarettes from '../utils/pm25ToCigarettes';
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
    isSearchVisible: false,
    showVideo: true
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

        // Un comment to get random location
        // coords = {
        //   latitude: Math.random() * 90,
        //   longitude: Math.random() * 90
        // };

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
            // ComponentDidCatch not working https://github.com/facebook/react-native/issues/18491
            // So we handle errors manually
            if (!response.data || !response.data.aqi) {
              throw new Error('AQI not defined in response.');
            }
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

  getVideoStyle = () => {
    const { api } = this.state;
    const cigarettes = pm25ToCigarettes(api);

    if (cigarettes <= 1) return { opacity: 0.2 };
    if (cigarettes < 5) return { opacity: 0.5 };
    if (cigarettes < 15) return { opacity: 0.7 };
    return { opacity: 1 };
  };

  handleLocationChanged = currentLocation => {
    this.setState({ currentLocation, isSearchVisible: false }, this.fetchData);
  };

  handleSearchHide = () => this.setState({ isSearchVisible: false });

  handleSearchShow = () => this.setState({ isSearchVisible: true });

  handleVideoStatus = ({ didJustFinish }) => {
    if (didJustFinish && this.state.showVideo) {
      this.setState({ showVideo: false });
    }
  };

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
    const { api, currentLocation, error, gps, showVideo } = this.state;

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
        {showVideo && (
          <Video
            onPlaybackStatusUpdate={this.handleVideoStatus}
            resizeMode="cover"
            shouldPlay
            source={smokeVideo}
            style={[styles.video, this.getVideoStyle()]}
          />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  video: {
    bottom: 0,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    right: 0,
    width: Dimensions.get('screen').width,
    zIndex: -1
  }
});
