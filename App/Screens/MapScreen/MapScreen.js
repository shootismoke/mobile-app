import React, { Component } from 'react';
import ActionButton from 'react-native-action-button';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../../BackButton';
import getCorrectLatLng from '../../utils/getCorrectLatLng';
import Header from '../../Header';
import * as theme from '../../utils/theme';

export default class MapScreen extends Component {
  handleRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const {
      onClose,
      screenProps: { api, gps },
      ...rest
    } = this.props;

    const station = {
      description: api.attributions.length ? api.attributions[0].name : null,
      latitude: api.city.geo[0],
      longitude: api.city.geo[1],
      title: api.city.name
    };
    const { latitude, longitude } = getCorrectLatLng(gps, station);

    return (
      <View style={styles.container}>
        <BackButton onClick={onClose} />
        <Header
          api={api}
          gps={gps}
          showChangeLocation={false}
          style={styles.header}
        />
        <View style={styles.mapContainer}>
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
        </View>
        <ActionButton
          buttonColor={theme.primaryColor}
          buttonText="&times;"
          elevation={3}
          onPress={onClose}
          position="center"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  map: {
    flex: 1
  },
  mapContainer: {
    flexGrow: 1
  }
});
