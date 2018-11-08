// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { About } from './About';
import * as theme from '../../utils/theme';

export class Footer extends Component {
  static defaultProps = {
    text: 'Click to understand how we did the math.'
  };

  state = {
    isAboutVisible: false
  };

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  render () {
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
    marginBottom: 22,
    marginTop: 22
  },
  link: {
    ...theme.text,
    ...theme.link,
    fontSize: 13
  }
});
