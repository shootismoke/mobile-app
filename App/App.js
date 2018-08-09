// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Font } from 'expo';

import Screens from './Screens';
import LoadingBackground from './Screens/Loading/Background';

export default class App extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount () {
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
