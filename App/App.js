import React, { Component } from 'react';
import { Font } from 'expo';

import Error from './Error';
import Home from './Home';
import LoadingBackground from './Loading/Background';

export default class App extends Component {
  state = {
    hasError: false,
    fontLoaded: false
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    const { fontLoaded, hasError } = this.state;

    if (hasError) {
      return <Error />;
    }
    return this.state.fontLoaded ? <Home /> : <LoadingBackground />;
  }
}
