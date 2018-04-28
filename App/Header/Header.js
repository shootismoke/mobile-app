import React, { Component } from 'react';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../BackButton';
import location from '../../assets/images/location.png';
import * as theme from '../utils/theme';

export default class Header extends Component {
  static defaultProps = {
    showChangeLocation: true
  };

  render() {
    const {
      api,
      elevated,
      gps,
      onBackClick,
      onChangeLocationClick,
      onClick,
      showBackButton,
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
      <View
        style={[styles.container, elevated ? styles.elevated : null, style]}
      >
        {showBackButton && (
          <BackButton onClick={onBackClick} style={styles.backButton} />
        )}
        <TouchableOpacity disabled={!onClick} onPress={onClick}>
          <View style={styles.titleGroup}>
            <Image source={location} />

            <Text style={styles.title}>{api.city.name.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.subtitleGroup}>
          <TouchableOpacity onPress={onChangeLocationClick}>
            <Text style={styles.subtitle}>
              {distance}km from you{showChangeLocation && (
                <Text>
                  {' '}
                  &bull; <Text style={theme.link}>Change your location</Text>
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 22
  },
  container: {
    backgroundColor: theme.backgroundColor,
    paddingBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 22
  },
  elevated: {
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 10
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
