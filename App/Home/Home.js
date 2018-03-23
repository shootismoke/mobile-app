import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Home extends Component {
  state = {
    api: null,
    gps: null
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      gps => {
        this.setState({ gps });
      },
      console.log,
      {}
    );
  }

  render() {
    const { gps } = this.state;
    return (
      <View style={styles.container}>
        <Text>My location is {JSON.stringify(gps)}</Text>
        <Text>Open up Home.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
