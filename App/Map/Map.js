import React, { Component } from 'react';
import { MapView } from 'expo';
import { Modal, StyleSheet, Text, View } from 'react-native';

export default class Map extends Component {
  handleRef = ref => {
    this.marker = ref;
  };

  handleShowCallout = () => {
    this.marker && this.marker.showCallout && this.marker.showCallout();
  };

  render() {
    const {
      station: { description, latitude, longitude, title },
      ...rest
    } = this.props;

    return (
      <Modal animationType="fade" transparent={true} {...rest}>
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
              title={title}
            />
          </MapView>
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
