// Copyright (c) 2018, Amaury Martiny and the Sh*t! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import error from '../../../assets/images/error.png';
import Footer from '../../Footer';
import * as theme from '../../utils/theme';

export default class ErrorScreen extends Component {
  render() {
    const { onChangeLocationClick } = this.props;
    return (
      <View style={styles.container}>
        <View />
        <View>
          <Image source={error} />
          <View>
            <Text style={styles.errorText}>
              <Text style={styles.sorry}>Sorry!</Text>
              {'\n'}We cannot{'\n'}load your cigarettes.
            </Text>
          </View>
          <TouchableOpacity onPress={onChangeLocationClick}>
            <View style={styles.chooseOther}>
              <Text style={theme.bigButtonText}>CHOOSE OTHER LOCATION</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.errorDescription}>
            There's either a problem with our databases, or you don't have any
            Air Monitoring Stations near you. Try again later!
          </Text>
          <Footer text="Click to know how the app works." />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chooseOther: {
    ...theme.bigButton,
    marginTop: 22
  },
  container: {
    ...theme.fullScreen,
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  errorDescription: {
    ...theme.text,
    ...theme.paragraph
  },
  errorText: {
    ...theme.shitText,
    marginTop: 31
  },
  sorry: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
