import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../BackButton';
import getCorrectLatLng from '../utils/getCorrectLatLng';
import location from '../../assets/images/location.png';
import * as theme from '../utils/theme';

export default class Header extends Component {
  static defaultProps = {
    showChangeLocation: true
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          currentLocation.latitude
        },${currentLocation.longitude}&key=${
          Constants.manifest.extra.googleGeocodingApiKey
        }&language=en`
      );

      // If we got data from the Google Geocoding service, then we use that one
      if (!data || !data.results || !data.results.length) {
        throw new Error();
      }

      const geoname = data.results[0];
      if (!geoname.formatted_address) {
        throw new Error();
      }

      // We format the formatted_address to remove postal code and street number for privacy reasons
      const postalCode = geoname.address_components.find(component =>
        component.types.includes('postal_code')
      );
      const streetNumber = geoname.address_components.find(component =>
        component.types.includes('street_number')
      );

      this.setState({
        locationName: geoname.formatted_address
          .replace(postalCode && postalCode.long_name, '')
          .replace(streetNumber && streetNumber.long_name, '')
          .replace(', ,', ',') // Remove unnecessary commas
          .replace(/ +/g, ' ') // Remove double spaces
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
        <TouchableOpacity disabled={!onClick} onPress={onClick}>
          <View style={styles.titleGroup}>
            <Image source={location} />

            <Text style={styles.title}>{locationName}</Text>
          </View>
          <View style={styles.subtitleGroup}>
            <Text style={styles.subtitle}>
              Nearest air quality station {distance}km from you
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 22
  },
  container: {
    paddingBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 18
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
