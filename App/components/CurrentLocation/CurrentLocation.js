// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import { StyleSheet, Text } from 'react-native';

import * as theme from '../../utils/theme';

export class CurrentLocation extends Component {
  state = {
    locationName: 'Fetching...'
  };

  async componentDidMount() {
    const { api, currentLocation } = this.props;

    // If our currentLocation already has a name (from Algolia), then we don't
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
      // Show AQI station name if we don't have reverse geocoding data
      this.setState({ locationName: api.city.name.toUpperCase() });
    }
  }

  render() {
    const { api, currentLocation, style, ...rest } = this.props;
    const { locationName } = this.state;

    return (
      <Text style={[styles.title, style]} {...rest}>
        {locationName}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    ...theme.title
  }
});
