import React, { Component } from 'react';
import ActionButton from 'react-native-action-button';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import getCorrectLatLng from './utils/getCorrectLatLng';
import Header from '../Header';
import * as theme from '../utils/theme';

export default class Map extends Component {
  handleRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const { api, gps, onRequestClose, station, ...rest } = this.props;

    const { latitude, longitude } = getCorrectLatLng(gps, station);

    return (
      <Modal animationType="fade" onRequestClose={onRequestClose} {...rest}>
        <View style={styles.container}>
          <Header
            api={api}
            onLocationClick={onRequestClose}
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
            onPress={onRequestClose}
            position="center"
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...theme.fullScreen,
    ...theme.modal
  },
  header: {
    elevation: 2
  },
  map: {
    flex: 1
  },
  mapContainer: {
    flex: 1
  }
});
