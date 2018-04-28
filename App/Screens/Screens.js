import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import retry from 'async-retry';
import { StackNavigator } from 'react-navigation';
import { StyleSheet, View } from 'react-native';

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
    gps: null,
    isSearchVisible: false
  };

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

  handleSearchHide = () => this.setState({ isSearchVisible: false });

  handleSearchShow = () => this.setState({ isSearchVisible: true });

  render() {
    const { api, gps, isSearchVisible } = this.state;

    if (!api) {
      return <Loading api={api} gps={gps} />;
    }

    return (
      <View style={theme.fullScreen}>
        <RootStack
          screenProps={{
            api,
            gps,
            onChangeLocationClick: this.handleSearchShow
          }}
        />
        <Search
          gps={gps}
          onRequestClose={this.handleSearchHide}
          visible={isSearchVisible}
        />
      </View>
    );
  }
}
