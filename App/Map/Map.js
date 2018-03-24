import React, { Component } from 'react';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import getCorrectLatLng from './utils/getCorrectLatLng';

export default class Map extends Component {
  handleRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const { gps, onRequestClose, station, ...rest } = this.props;

    const { latitude, longitude } = getCorrectLatLng(gps, station);

    return (
      <Modal
        animationType="fade"
        onRequestClose={onRequestClose}
        transparent={true}
        {...rest}
      >
        <View style={styles.container}>
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
          <TouchableOpacity onPress={onRequestClose}>
            <Text>BACK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});
