// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { About } from '../../Screens/About';
import * as theme from '../../utils/theme';

export class Footer extends PureComponent {
  static defaultProps = {
    text: 'Click to understand how we did the math.'
  };

  state = {
    isAboutVisible: false
  };

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  render() {
    const { style, text } = this.props;
    const { isAboutVisible } = this.state;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity onPress={this.handleAboutShow}>
          <Text style={styles.link}>{text}</Text>
        </TouchableOpacity>
        <About onRequestClose={this.handleAboutHide} visible={isAboutVisible} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.defaultSpacing,
    marginTop: theme.defaultSpacing
  },
  link: {
    ...theme.text,
    ...theme.link,
    fontSize: 13
  }
});
