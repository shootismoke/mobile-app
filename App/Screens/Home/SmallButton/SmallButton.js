// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as theme from '../../../utils/theme';

export class SmallButton extends Component {
  render() {
    const { text, ...rest } = this.props;

    return (
      <TouchableOpacity {...rest}>
        <Text style={styles.title}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    ...theme.title,
    color: theme.primaryColor
  }
});
