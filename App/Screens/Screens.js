// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { About } from './About';
import { Details } from './Details';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { Search } from './Search';
import * as theme from '../utils/theme';

const stackNavigatorOptions = initialRouteName => ({
  cardStyle: {
    backgroundColor: theme.backgroundColor
  },
  headerMode: 'none',
  initialRouteName,
  defaultNavigationOptions: {
    headerVisible: false
  }
});

/**
 * The main stack navigator, for the app.
 */
const RootStack = createAppContainer(
  createStackNavigator(
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
  )
);

/**
 * A second stack navigator, for the error case.
 */
const ErrorStack = createAppContainer(
  createStackNavigator(
    {
      Error: {
        screen: ErrorScreen
      },
      Search: {
        screen: Search
      }
    },
    stackNavigatorOptions('Error')
  )
);

@inject('stores')
@observer
export class Screens extends Component {
  componentDidCatch (error) {
    this.props.stores.setError(error.message);
  }

  render () {
    return <View style={theme.fullScreen}>{this.renderScreen()}</View>;
  }

  renderScreen = () => {
    const {
      stores: { api, error, location }
    } = this.props;

    if (error) {
      return <ErrorStack />;
    }

    if (!api || !location.current) {
      return <Loading />;
    }

    return <RootStack />;
  };
}
