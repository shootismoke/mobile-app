// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React, { useContext } from 'react';
import { StatusBar, View } from 'react-native';
import {
  createAppContainer,
  CreateNavigatorConfig,
  NavigationRoute,
  NavigationStackRouterConfig
} from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackConfig,
  NavigationStackOptions,
  NavigationStackProp
} from 'react-navigation-stack';
import { fadeIn } from 'react-navigation-transitions';

import { Api, ApiContext, ErrorContext } from '../stores';
import * as theme from '../util/theme';
import { About } from './About';
import { Details } from './Details';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { Search } from './Search';
import { ShareScreen } from './ShareScreen';

function stackNavigatorOptions(
  initialRouteName: string
): CreateNavigatorConfig<
  NavigationStackConfig,
  NavigationStackRouterConfig,
  NavigationStackOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NavigationStackProp<NavigationRoute, any>
> {
  return {
    cardStyle: {
      backgroundColor: theme.backgroundColor
    },
    headerMode: 'none',
    initialRouteName,
    defaultNavigationOptions: {
      // FIXME the `headerVisible` field has been moved away from this config
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      headerVisible: false
    }
  };
}

/**
 * The main stack navigator, for the app.
 */
const MainStack = createAppContainer(
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

const RootStack = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: MainStack
      },
      ShareModal: {
        screen: ShareScreen
      }
    },
    {
      mode: 'modal',
      headerMode: 'none',
      transitionConfig: () => fadeIn()
    }
  )
);
/**
 * A stack navigator for the error case.
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

function renderScreen(api?: Api, error?: Error): React.ReactElement {
  if (error) {
    return <ErrorStack />;
  }

  if (!api) {
    return <Loading />;
  }

  return <RootStack />;
}

export function Screens(): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { error } = useContext(ErrorContext);

  const stack = renderScreen(api, error);

  return (
    <View style={theme.fullScreen}>
      <StatusBar barStyle="dark-content" />
      {stack}
    </View>
  );
}
