// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Location, Permissions, Video } from 'expo';
import retry from 'async-retry';
import { createStackNavigator } from 'react-navigation';

import * as dataSources from '../utils/dataSources';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { MapScreen } from './MapScreen';
import { pm25ToCigarettes } from '../utils/pm25ToCigarettes';
import { Search } from './Search';
import smokeVideo from '../../assets/video/smoke.mp4';
import * as theme from '../utils/theme';

const RootStack = createStackNavigator(
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

export class Screens extends Component {
  state = {
    api: null,
    chosenLocation: null, // Initialized to GPS, but can be changed by user
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
    const { chosenLocation } = this.state;
    try {
      this.setState({ api: null, error: null });

      // If the chosenLocation has been set by the user, then we don't refetch
      // the user's GPS
      let coords;
      if (!chosenLocation) {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied.');
        }

        const { coords } = await Location.getCurrentPositionAsync({});

        // Uncomment to get random location
        // coords = {
        //   latitude: Math.random() * 90,
        //   longitude: Math.random() * 90
        // };

        this.setState({ chosenLocation: coords, gps: coords });
      }

      // We currently have 2 sources, aqicn, and windWaqi
      // We put them in an array
      const sources = [dataSources.aqicn, dataSources.windWaqi];

      const api = await retry(
        async (_, attempt) => {
          // Attempt starts at 1
          const result = await sources[(attempt - 1) % 2](
            chosenLocation || coords
          );
          return result;
        },
        { retries: 3 } // 2 attemps per source
      );
      this.setState({ api });
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  getVideoStyle = () => {
    const {
      api: { pm25 }
    } = this.state;
    const cigarettes = pm25ToCigarettes(pm25);

    if (cigarettes <= 1) return { opacity: 0.2 };
    if (cigarettes < 5) return { opacity: 0.5 };
    if (cigarettes < 15) return { opacity: 0.7 };
    return { opacity: 1 };
  };

  handleLocationChanged = chosenLocation => {
    this.setState({ chosenLocation, isSearchVisible: false }, this.fetchData);
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
    const { api, chosenLocation, error, gps, showVideo } = this.state;

    if (error) {
      return (
        <ErrorScreen gps={gps} onChangeLocationClick={this.handleSearchShow} />
      );
    }

    if (!api || !chosenLocation) {
      return <Loading gps={gps} />;
    }

    return (
      <View style={theme.fullScreen}>
        <RootStack
          screenProps={{
            api,
            chosenLocation,
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
