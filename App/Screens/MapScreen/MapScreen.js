import React, { Component } from 'react';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../../BackButton';
import getCorrectLatLng from '../../utils/getCorrectLatLng';
import Header from '../../Header';
import * as theme from '../../utils/theme';

export default class MapScreen extends Component {
  static navigationOptions = {
    header: props => {
      return (
        <Header
          {...props.screenProps}
          onBackClick={props.navigation.pop}
          showBackButton
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

  handleRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const {
      screenProps: { api, gps },
      ...rest
    } = this.props;
    const { showMap } = this.state;

    const station = {
      description: api.attributions.length ? api.attributions[0].name : null,
      latitude: api.city.geo[0],
      longitude: api.city.geo[1],
      title: api.city.name
    };
    const { latitude, longitude } = getCorrectLatLng(gps, station);

    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {showMap && (
            <MapView
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              onMapReady={this.handleShowCallout}
              style={styles.map}
            >
              <MapView.Marker
                color={theme.primaryColor}
                coordinate={{ latitude, longitude }}
                ref={this.handleRef}
                title={station.title}
                description={station.description}
              />
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
  map: {
    flex: 1
  },
  mapContainer: {
    flexGrow: 1
  }
});
