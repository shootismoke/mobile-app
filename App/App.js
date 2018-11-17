// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { PureComponent } from 'react';
import { Font } from 'expo';
import { Provider } from 'mobx-react';

import { RootStore } from './stores';
import { Background as LoadingBackground } from './Screens/Loading/Background';
import { Screens } from './Screens';

// Set up global MST stores
const stores = RootStore.create({ api: undefined, error: false, location: {} });

export class App extends PureComponent {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    // Using custom fonts with Expo
    // https://docs.expo.io/versions/latest/guides/using-custom-fonts
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    const { fontLoaded } = this.state;

    return fontLoaded ? (
      <Provider stores={stores}>
        <Screens />
      </Provider>
    ) : (
      <LoadingBackground />
    );
  }
}
