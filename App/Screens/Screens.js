// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Video } from 'expo';
import { createStackNavigator } from 'react-navigation';

import { About } from './About';
import { Details } from './Details';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { Search } from './Search';
import smokeVideo from '../../assets/video/smoke.mp4';
import * as theme from '../utils/theme';

const stackNavigatorOptions = initialRouteName => ({
  cardStyle: {
    backgroundColor: theme.backgroundColor
  },
  headerMode: 'none',
  initialRouteName,
  navigationOptions: {
    headerVisible: false
  }
});

/**
 * The main stack navigator, for the app.
 */
const RootStack = createStackNavigator(
  {
    About: {
      screen: About
    },
    Details: {
      screen: Details
    },
    Home: {
      screen: Home
    },
    Search: {
      screen: Search
    }
  },
  stackNavigatorOptions('Home')
);

/**
 * A second stack navigator, for the error case.
 */
const ErrorStack = createStackNavigator(
  {
    Error: {
      screen: ErrorScreen
    },
    Search: {
      screen: Search
    }
  },
  stackNavigatorOptions('Error')
);

@inject('stores')
@observer
export class Screens extends Component {
  state = {
    showVideo: true // Showing video or not
  };

  componentDidCatch(error) {
    this.props.stores.setError(error);
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
      stores: { api, error, location }
    } = this.props;
    const { showVideo } = this.state;

    if (error) {
      return <ErrorStack />;
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
