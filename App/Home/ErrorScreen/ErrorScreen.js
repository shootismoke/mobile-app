import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import error from '../../../assets/images/error.png';
import Footer from '../../Footer';
import * as theme from '../../utils/theme';

export default class ErrorScreen extends Component {
  render() {
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
            <Text style={styles.errorDescription}>
              There's either a problem with our databases, or you don't have any
              Air Monitoring Stations near you. Try again later!
            </Text>
          </View>
        </View>
        <Footer text="Click to know how the app works." />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  errorDescription: {
    ...theme.text,
    marginTop: 31
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
