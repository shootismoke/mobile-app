// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as theme from '../../../utils/theme';

export const SmallButton = ({ text, ...rest }) => (
  <TouchableOpacity {...rest}>
    <Text style={styles.title}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    ...theme.title,
    color: theme.primaryColor
  }
});
