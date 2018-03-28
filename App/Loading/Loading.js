import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Background from './Background';
import * as theme from '../utils/theme';

export default class Loading extends Component {
  render() {
    return (
      <Background style={styles.container}>
        <Text style={styles.text}>{this.renderText()}</Text>
      </Background>
    );
  }

  renderText = () => {
    const { api, gps, ...rest } = this.props;
    if (!gps)
      return (
        <Text>
          Cough<Text style={styles.dots}>...</Text> Loading<Text
            style={styles.dots}
          >
            ...
          </Text>{' '}
          Cough<Text style={styles.dots}>...</Text>
        </Text>
      );

    if (!api)
      return (
        <Text>
          Escaping from the smoking area<Text style={styles.dots}>...</Text>
        </Text>
      );

    return '';
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
