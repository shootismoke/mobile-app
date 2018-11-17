// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Location, Permissions } from 'expo';
import retry from 'async-retry';
import { StyleSheet, Text } from 'react-native';

import { Background } from './Background';
import * as dataSources from '../../utils/dataSources';
import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class Loading extends Component {
  state = {
    longWaiting: false // If api is taking a long time
  };

  longWaitingTimeout = null; // The variable returned by setTimeout for longWaiting

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.stores.gps && this.props.gps) {
      // Start a 2s timeout to occupy user while he's waiting.
      this.longWaitingTimeout = setTimeout(
        () => this.setState({ longWaiting: true }),
        2000 // Set longWaiting after 2s of waiting
      );
    }
  }

  componentWillUnmount() {
    if (this.longWaitingTimeout) {
      clearTimeout(this.longWaitingTimeout);
    }
  }

  async fetchData() {
    const { stores } = this.props;
    const { location } = stores;
    const { gps } = stores; // eslint-disable-line Only used to track mobx variable

    try {
      // The current { latitude, longitude } the user chose
      let currentPosition = location.current;

      this.setState({ error: null });

      // If the currentLocation has been set by the user, then we don't refetch
      // the user's GPS
      if (!currentPosition) {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied.');
        }

        // const { coords } = await Location.getCurrentPositionAsync({});
        // Uncomment to get random location
        // coords = {
        //   latitude: Math.random() * 90,
        //   longitude: Math.random() * 90
        // };
        coords = {
          latitude: 48.4,
          longitude: 2.34
        };

        currentPosition = coords;

        location.setCurrent(coords);
        location.setGps(coords);
      }

      // We currently have 2 sources, aqicn, and windWaqi
      // We put them in an array
      const sources = [dataSources.aqicn, dataSources.windWaqi];

      const _api = await retry(
        async (_, attempt) => {
          // Attempt starts at 1
          const result = await sources[(attempt - 1) % 2](currentPosition);
          return result;
        },
        { retries: 3 } // 2 attemps per source
      );

      stores.setApi(_api);
    } catch (error) {
      // TODO Add to sentry
      // https://github.com/amaurymartiny/shoot-i-smoke/issues/22
      stores.setError(true);
    }
  }

  render() {
    return (
      <Background style={styles.container}>
        <Text style={styles.text}>{this.renderText()}</Text>
      </Background>
    );
  }

  renderCough = index => (
    <Text key={index}>
      Cough
      <Text style={styles.dots}>...</Text>
    </Text>
  );

  renderText = () => {
    const {
      stores: {
        api, // eslint-disable-line Only used to subscribe to the mobx variable
        location: { gps }
      }
    } = this.props;
    const { longWaiting } = this.state;
    let coughs = 0; // Number of times to show "Cough..."
    if (gps) ++coughs;
    if (longWaiting) ++coughs;

    return (
      <Text>
        Loading
        <Text style={styles.dots}>...</Text>
        {Array.from({ length: coughs }, (_, index) => index + 1).map(
          // Create array 1..N and rendering Cough...
          this.renderCough
        )}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding
  },
  dots: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
