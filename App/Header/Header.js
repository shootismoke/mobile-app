import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import location from '../../assets/images/location.png';
import Map from '../Map';
import * as theme from '../utils/theme';

export default class Header extends Component {
  render() {
    const { api, hidden, onLocationClick, style } = this.props;
    return (
      <View style={[styles.header, hidden ? styles.hidden : null, style]}>
        <TouchableOpacity disabled={!api} onPress={onLocationClick}>
          <View style={styles.titleGroup}>
            <Image source={location} />

            <Text style={styles.title}>
              {api ? api.city.name.toUpperCase() : 'Loading...'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.subtitleGroup}>
          {api ? (
            <Text style={styles.subtitle}>
              {/* new Date() not working in expo https://github.com/expo/expo/issues/782 */}
              {api.time.s.split(' ')[0].replace(/-/g, '/')}
            </Text>
          ) : (
            <Text style={styles.subtitle}>Loading...</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.backgroundColor,
    paddingBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 22
  },
  hidden: {
    opacity: 0
  },
  titleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 3
  },
  subtitle: {
    ...theme.text,
    fontSize: 12,
    marginLeft: 33, // Picutre width (22) + marginleft (11)
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 15,
    marginLeft: 11
  }
});
