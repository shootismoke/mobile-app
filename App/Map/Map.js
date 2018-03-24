import React, { Component } from 'react';
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
      <Modal
        animationType="fade"
        onRequestClose={onRequestClose}
        transparent={true}
        {...rest}
      >
        <View style={styles.container}>
          <Header api={api} onLocationClick={onRequestClose} />
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onMapReady={this.handleShowCallout}
          >
            <MapView.Marker
              coordinate={{ latitude, longitude }}
              ref={this.handleRef}
              title={station.title}
            />
          </MapView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...theme.fullScreen
  },
  map: {
    flex: 1
  }
});
