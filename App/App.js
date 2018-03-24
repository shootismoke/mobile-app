import React, { Component } from 'react';
import { Font } from 'expo';
import { Text } from 'react-native';

import Home from './Home';

export default class App extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded ? <Home /> : <Text>Loading...</Text>;
  }
}
