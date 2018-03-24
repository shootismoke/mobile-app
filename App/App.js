import React, { Component } from 'react';
import { Font } from 'expo';

import Home from './Home';

export default class App extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'helvetica-regular': require('../assets/fonts/Helvetica-Regular.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded && <Home />;
  }
}
