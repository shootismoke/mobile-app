// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Location, Permissions, Video } from 'expo';
import retry from 'async-retry';
import { createStackNavigator } from 'react-navigation';

import { About } from './About';
import * as dataSources from '../utils/dataSources';
import { Details } from './Details';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { Search } from './Search';
import smokeVideo from '../../assets/video/smoke.mp4';
import * as theme from '../utils/theme';

const RootStack = createStackNavigator(
  {
    About: {
      screen: About
    },
    Details: {
      screen: Details
    },
    Error: {
      screen: ErrorScreen
    },
    Home: {
      screen: Home
    },
    Search: {
      screen: Search
    }
  },
  {
    cardStyle: {
      backgroundColor: theme.backgroundColor
    },
    headerMode: 'none',
    initialRouteName: 'Home',
    navigationOptions: {
      headerVisible: false
    }
  }
);

@inject('stores')
@observer
export class Screens extends Component {
  state = {
    error: null, // Error here or in children component tree
    showVideo: true // Showing video or not
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  async fetchData() {
    const { stores } = this.props;
    const { api, location } = stores;

    try {
      // The current { latitude, longitude } the user chose
      let currentPosition = location.current;

      this.setState({ error: null });

      // If the currentLocation has been set by the user, then we don't refetch
      // the user's GPS
      if (!currentPosition) {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied.');
        }

        // const { coords } = await Location.getCurrentPositionAsync({});
        // Uncomment to get random location
        // coords = {
        //   latitude: Math.random() * 90,
        //   longitude: Math.random() * 90
        // };
        coords = {
          latitude: 48.4,
          longitude: 2.34
        };

        currentPosition = coords;

        location.setCurrent(coords);
        location.setGps(coords);
      }

      // We currently have 2 sources, aqicn, and windWaqi
      // We put them in an array
      const sources = [dataSources.aqicn, dataSources.windWaqi];

      const _api = await retry(
        async (_, attempt) => {
          // Attempt starts at 1
          const result = await sources[(attempt - 1) % 2](currentPosition);
          return result;
        },
        { retries: 3 } // 2 attemps per source
      );

      stores.setApi(_api);
    } catch (error) {
      // TODO Add to sentry
      console.error(error);
      this.setState({ error });
    }
  }

  getVideoStyle = () => {
    const {
      stores: { cigarettes }
    } = this.props;

    if (cigarettes <= 1) return { opacity: 0.2 };
    if (cigarettes < 5) return { opacity: 0.5 };
    if (cigarettes < 15) return { opacity: 0.7 };
    return { opacity: 1 };
  };

  handleVideoStatus = ({ didJustFinish }) => {
    if (didJustFinish && this.state.showVideo) {
      this.setState({ showVideo: false });
    }
  };

  render() {
    return <View style={styles.container}>{this.renderScreen()}</View>;
  }

  renderScreen = () => {
    const {
      stores: { api, location }
    } = this.props;
    const { error, showVideo } = this.state;

    if (error) {
      return (
        <ErrorScreen
          gps={location.gps}
          onChangeLocationClick={this.handleSearchShow}
        />
      );
    }

    if (!api || !location.gps) {
      return <Loading gps={location.gps} />;
    }

    return (
      <View style={theme.fullScreen}>
        <RootStack
          screenProps={{
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
