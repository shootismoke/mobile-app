import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import * as theme from '../utils/theme';

export default class Background extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...theme.fullScreen,
    alignItems: 'center',
    backgroundColor: theme.iconBackgroundColor,
    justifyContent: 'center'
  }
});
