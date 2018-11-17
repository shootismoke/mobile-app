// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import error from '../../../assets/images/error.png';
import * as theme from '../../utils/theme';

export class ErrorScreen extends Component {
  goToSearch = () => this.props.navigation.navigate('Search');

  render () {
    return (
      <View style={styles.container}>
        <View />
        <View>
          <Image source={error} />
          <View>
            <Text style={styles.errorText}>
              <Text style={styles.sorry}>Sorry!</Text>
              {'\n'}
              We cannot
              {'\n'}
              load your cigarettes.
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={this.goToSearch}>
            <View style={styles.chooseOther}>
              <Text style={theme.bigButtonText}>CHOOSE OTHER LOCATION</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.errorDescription}>
            There's either a problem with our databases, or you don't have any
            Air Monitoring Stations near you. Try again later!
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chooseOther: {
    ...theme.bigButton,
    marginVertical: theme.spacing.normal
  },
  container: {
    ...theme.fullScreen,
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  errorDescription: {
    ...theme.text
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
