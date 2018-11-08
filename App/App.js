// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Font } from 'expo';

import { Screens } from './Screens';
import { Background as LoadingBackground } from './Screens/Loading/Background';

export class App extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount () {
    // Using custom fonts with Expo
    // https://docs.expo.io/versions/latest/guides/using-custom-fonts
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render () {
    const { fontLoaded } = this.state;

    return fontLoaded ? <Screens /> : <LoadingBackground />;
  }
}
