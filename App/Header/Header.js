import React, { Component } from 'react';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import location from '../../assets/images/location.png';
import * as theme from '../utils/theme';

export default class Header extends Component {
  static defaultProps = {
    showChangeLocation: true
  };

  render() {
    const {
      api,
      gps,
      hidden,
      onLocationClick,
      showChangeLocation,
      style
    } = this.props;
    const distance = Math.round(
      haversine(gps, {
        latitude: api.city.geo[0],
        longitude: api.city.geo[1]
      })
    );
    return (
      <View style={[styles.header, hidden ? styles.hidden : null, style]}>
        <TouchableOpacity disabled={!api} onPress={onLocationClick}>
          <View style={styles.titleGroup}>
            <Image source={location} />

            <Text style={styles.title}>{api.city.name.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.subtitleGroup}>
          <Text style={styles.subtitle}>
            {distance}km from you{showChangeLocation && (
              <Text>
                {' '}
                &bull; <Text style={theme.link}>Change your location</Text>
              </Text>
            )}
          </Text>
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
    marginLeft: 33, // Picutre width (22) + marginleft (11)
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 15,
    marginLeft: 11
  }
});
