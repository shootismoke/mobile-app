// Copyright (c) 2018, Amaury Martiny and the Sh*t! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Background from './Background';
import * as theme from '../../utils/theme';

export default class Loading extends Component {
  static propTypes = {
    gps: PropTypes.object
  };

  state = {
    longWaiting: false // If api is taking a long time
  };

  longWaitingTimeout = null; // The variable returned by setTimeout for longWaiting

  componentWillReceiveProps({ gps }) {
    if (!this.props.gps && gps) {
      this.longWaitingTimeout = setTimeout(
        () => this.setState({ longWaiting: true }),
        2000 // Set longWaiting after 2s of waiting
      );
    }
  }

  componentWillUnmount() {
    if (this.longWaitingTimeout) {
      clearTimeout(this.longWaitingTimeout);
    }
  }

  render() {
    return (
      <Background style={styles.container}>
        <Text style={styles.text}>{this.renderText()}</Text>
      </Background>
    );
  }

  renderCough = index => (
    <Text key={index}>
      Cough<Text style={styles.dots}>...</Text>
    </Text>
  );

  renderText = () => {
    const { gps } = this.props;
    const { longWaiting } = this.state;
    let coughs = 0; // Number of times to show "Cough..."
    if (gps) ++coughs;
    if (longWaiting) ++coughs;

    return (
      <Text>
        Loading<Text style={styles.dots}>...</Text>
        {Array.from({ length: coughs }, (_, index) => index + 1).map(
          // Create array 1..N and rendering Cough...
          this.renderCough
        )}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding
  },
  dots: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
