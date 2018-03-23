import React, { Component } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

export default class Map extends Component {
  render() {
    const { ...rest } = this.props;

    return (
      <Modal animationType="fade" transparent={true} {...rest}>
        <View style={styles.container}>
          <Text>Map goes here</Text>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});
