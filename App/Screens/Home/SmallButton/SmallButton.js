// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import * as theme from '../../../utils/theme';

export const SmallButton = ({ text, icon, ...rest }) => (
  <TouchableOpacity style={styles.container} {...rest}>
    {icon && (
      <FontAwesome
        color={theme.primaryColor}
        name={icon}
        size={15}
        style={styles.icon}
      />
    )}
    <Text style={styles.title}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  icon: {
    marginRight: theme.spacing.tiny
  },
  title: {
    ...theme.title,
    color: theme.primaryColor,
    lineHeight: 15
  }
});
