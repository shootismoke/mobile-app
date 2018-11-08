// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BackButton } from '../BackButton';
import changeLocation from '../../../assets/images/changeLocation.png';
import { getCorrectLatLng } from '../../utils/getCorrectLatLng';
import * as theme from '../../utils/theme';

export class Header extends Component {
  static defaultProps = {
    showChangeLocation: false
  };

  state = {
    locationName: 'FETCHING...'
  };

  async componentDidMount() {
    const { api, currentLocation } = this.props;

    // If our currentLocation already has a name (from algolia), then we don't
    // need Google Geocoding for the name
    if (currentLocation.name) {
      this.setState({ locationName: currentLocation.name.toUpperCase() });
      return;
    }

    try {
      const { data } = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${
          Constants.manifest.extra.locationIqKey
        }&lat=${currentLocation.latitude}&lon=${
          currentLocation.longitude
        }&format=json`
      );

      // If we got data from the Google Geocoding service, then we use that one
      if (!data || !data.address || !data.display_name) {
        throw new Error('No data from LocationIQ.');
      }

      // We format the formatted_address to remove postal code and street number for privacy reasons
      const postalCode = data.address.postcode;
      const streetNumber = data.address.house_number;

      this.setState({
        locationName: data.display_name
          .replace(postalCode, '')
          .replace(streetNumber, '')
          .replace(/^,/, '') // Remove starting comma
          .replace(', ,', ',') // Remove unnecessary commas
          .replace(/ +/g, ' ') // Remove double spaces
          .replace(' ,', ',') // Self-explanatory
          .trim()
          .toUpperCase()
      });
    } catch (error) {
      this.setState({ locationName: api.city.name.toUpperCase() });
    }
  }

  render() {
    const {
      api,
      currentLocation,
      elevated,
      onBackClick,
      onChangeLocationClick,
      onClick,
      showBackButton,
      showChangeLocation,
      style
    } = this.props;
    const { locationName } = this.state;
    const distance = Math.round(
      haversine(
        currentLocation,
        getCorrectLatLng(currentLocation, {
          latitude: api.city.geo[0],
          longitude: api.city.geo[1]
        })
      )
    );

    return (
      <View
        style={[
          styles.container,
          elevated ? theme.elevatedLevel1 : null,
          style
        ]}
      >
        {showBackButton && (
          <BackButton onClick={onBackClick} style={styles.backButton} />
        )}

        <View style={styles.content}>
          <TouchableOpacity
            disabled={!onClick}
            onPress={onClick}
            style={showChangeLocation ? { maxWidth: '80%' } : undefined}
          >
            <Text style={styles.title}>{locationName}</Text>
            <Text style={styles.subtitle}>
              Distance to Air Quality Station: {distance}
              km
            </Text>
          </TouchableOpacity>
          {showChangeLocation && (
            <TouchableOpacity onPress={onChangeLocationClick}>
              <Image source={changeLocation} style={styles.changeLocation} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 22
  },
  changeLocation: {
    marginRight: 5
  },
  container: {
    paddingBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 18
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subtitle: {
    ...theme.text,
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 15
  }
});
