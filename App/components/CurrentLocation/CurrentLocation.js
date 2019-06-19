// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Text } from 'react-native';

import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class CurrentLocation extends Component {
  state = {
    locationName: 'Fetching...'
  };

  async componentDidMount () {
    const {
      stores: { api, location }
    } = this.props;

    // If our currentLocation already has a name (from Algolia), then we don't
    // need Google Geocoding for the name
    if (location.name) {
      this.setState({ locationName: location.name.toUpperCase() });
      return;
    }

    try {
      console.log(
        '<CurrentLocation> - componentDidMount - Fetching reverse geocoding'
      );
      const { data } = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${
          Constants.manifest.extra.locationIqKey
        }&lat=${location.current.latitude}&lon=${
          location.current.longitude
        }&format=json`
      );

      // If we got data from the Google Geocoding service, then we use that one
      if (!data || !data.address || !data.display_name) {
        throw new Error('No data from LocationIQ.');
      }

      console.log('<CurrentLocation> - componentDidMount - Got result');

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
      console.log('<CurrentLocation> - componentDidMount - Error', error);

      // Show AQI station name if we don't have reverse geocoding data
      this.setState({
        locationName:
          api.city && api.city.name
            ? api.city.name.toUpperCase()
            : 'UNKNOWN AQI STATION'
      });
    }
  }

  render () {
    const { stores, style, ...rest } = this.props;
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
