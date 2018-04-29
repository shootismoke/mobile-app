import React, { Component } from 'react';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../../BackButton';
import getCorrectLatLng from '../../utils/getCorrectLatLng';
import Header from '../../Header';
import SearchHeader from '../Search/SearchHeader';
import * as theme from '../../utils/theme';
import truncate from 'truncate';

export default class MapScreen extends Component {
  static navigationOptions = {
    header: props => {
      return (
        <Header
          {...props.screenProps}
          elevated
          onBackClick={props.navigation.pop}
          showBackButton
          style={styles.header}
        />
      );
    }
  };

  state = {
    showMap: false
  };

  showMapTimeout = null;

  componentWillMount() {
    // Show map after 200ms for smoother screen transition
    setTimeout(() => this.setState({ showMap: true }), 500);
  }

  componentWillUnmount() {
    clearTimeout(this.showMapTimeout);
  }

  handleFitMarkers = () => this.map.fitToElements(false);

  handleMapRef = ref => {
    this.map = ref;
  };

  handleMarkerRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const {
      screenProps: { api, currentLocation, onChangeLocationClick },
      ...rest
    } = this.props;
    const { showMap } = this.state;

    const station = {
      description: api.attributions.length ? api.attributions[0].name : null,
      title: api.city.name,
      ...getCorrectLatLng(currentLocation, {
        latitude: api.city.geo[0],
        longitude: api.city.geo[1]
      })
    };

    return (
      <View style={styles.container}>
        <SearchHeader
          asTouchable
          elevated="very"
          onClick={onChangeLocationClick}
          onPress={onChangeLocationClick}
          search=""
        />
        <View style={styles.mapContainer}>
          {showMap && (
            <MapView
              initialRegion={{
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                ...currentLocation
              }}
              onLayout={this.handleFitMarkers}
              onMapReady={this.handleShowCallout}
              ref={this.handleMapRef}
              style={styles.map}
            >
              <MapView.Marker
                color={theme.primaryColor}
                coordinate={station}
                ref={this.handleMarkerRef}
                title={truncate(station.title, 15)}
                description={truncate(station.description, 40)}
              />
              <MapView.Marker color="blue" coordinate={currentLocation} />
            </MapView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexGrow: 1
  },
  header: {
    backgroundColor: theme.backgroundColor
  },
  map: {
    flexGrow: 1
  },
  mapContainer: {
    flexGrow: 1
  }
});
