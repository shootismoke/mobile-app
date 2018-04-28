import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import backIcon from '../../assets/images/back.png';
import * as theme from '../utils/theme';

export default class BackButton extends Component {
  render() {
    const { onClick, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={onClick}
          style={styles.backButton}
        >
          <Image source={backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  backText: {
    color: theme.secondaryTextColor,
    fontFamily: 'gotham-book',
    fontSize: 14,
    marginLeft: 9
  },
  container: {
    ...theme.withPadding,
    marginTop: 22
  }
});
