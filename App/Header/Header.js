import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';

import location from '../../assets/images/location.png';
import Map from '../Map';
import * as theme from '../utils/theme';

export default class Header extends Component {
  render() {
    const { api, hidden, onLocationClick } = this.props;
    return (
      <View style={[styles.header, hidden ? styles.hidden : null]}>
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
              {api.time.s.split(' ')[1].slice(0, -3)} &bull;{' '}
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
    marginTop: 23,
    marginBottom: 25,
    paddingHorizontal: 17
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
    fontSize: 10,
    marginLeft: 33, // Picutre width (22) + marginleft (11)
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 12,
    letterSpacing: 3.14,
    marginLeft: 11
  }
});
