// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Location, Permissions, TaskManager} from 'expo';
import retry from 'async-retry';
import {StyleSheet, Text} from 'react-native';

import {Background} from './Background';
import * as dataSources from '../../utils/dataSources';
import * as theme from '../../utils/theme';
import {i18n} from '../../localization';
import {AqiHistoryManager} from "../../managers";

const TASK_STORE_AQI_HISTORY = 'store-aqi-history';

@inject('stores')
@observer
export class Loading extends Component {
  state = {
    longWaiting: false // If api is taking a long time
  };

  longWaitingTimeout = null; // The variable returned by setTimeout for longWaiting

  async componentDidMount () {
    await this.fetchData();
    await this._startRecordingAqiHistory();
  }

  componentWillUnmount () {
    if (this.longWaitingTimeout) {
      clearTimeout(this.longWaitingTimeout);
    }
  }

  _startRecordingAqiHistory = async () => {
    await Location.startLocationUpdatesAsync(TASK_STORE_AQI_HISTORY, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: AqiHistoryManager.SAVE_DATA_INTERVAL,
      distanceInterval: 0,
    });
  };

  _apiCall = async (currentPosition) => {

    // We currently have 2 sources, aqicn, and windWaqi
    // We put them in an array
    const sources = [dataSources.aqicn, dataSources.windWaqi];

    return retry(
        async (_, attempt) => {
          // Attempt starts at 1
          console.log(
              `<Loading> - fetchData - Attempt #${attempt}: ${
                  sources[(attempt - 1) % 2].name
                  }`
          );
          const result = await sources[(attempt - 1) % 2](currentPosition);
          console.log('<Loading> - fetchData - Got result', result);

          return result;
        },
        {retries: 3} // 2 attempts per source
    );
  };

  async fetchData () {
    const { stores } = this.props;
    const { location } = stores;

    try {
      // The current { latitude, longitude } the user chose
      let currentPosition = location.current;

      // If the currentLocation has been set by the user, then we don't refetch
      // the user's GPS
      if (!currentPosition) {
        console.log('<Loading> - fetchData - Asking for location permission');
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        console.log('<Loading> - fetchData - Fetching location');
        const { coords } = await Location.getCurrentPositionAsync({
          timeout: 5000
        });
        // Uncomment to get other locations
        // const coords = {
        //   latitude: Math.random() * 90,
        //   longitude: Math.random() * 90
        // };
        // const coords = {
        //   latitude: 48.4,
        //   longitude: 2.34
        // };

        currentPosition = coords;
        console.log('<Loading> - fetchData - Got location', currentPosition);

        location.setCurrent(coords);
        location.setGps(coords);
      }

      // Set a 2s timer that will set `longWaiting` to true. Used to show an
      // additional "cough" message on the loading screen
      this.longWaitingTimeout = setTimeout(
        () => this.setState({ longWaiting: true }),
        2000
      );

      stores.setApi(await this._apiCall(currentPosition));
    } catch (error) {
      console.log('<Loading> - fetchData - Error', error);
      stores.setError(error.message);
    }
  }

  render () {
    return (
      <Background style={theme.withPadding}>
        <Text style={styles.text}>{this.renderText()}</Text>
      </Background>
    );
  }

  renderCough = index => (
    <Text key={index}>
      {i18n.t('loading_title_cough')}
      <Text style={styles.dots}>...</Text>
    </Text>
  );

  renderText = () => {
    const {
      stores: {
        api,
        location: { gps }
      }
    } = this.props;
    const { longWaiting } = this.state;
    let coughs = 0; // Number of times to show "Cough..."
    if (gps) ++coughs;
    if (longWaiting) ++coughs;
    if (api) ++coughs;

    return (
      <Text>
        {i18n.t('loading_title_loading')}
        <Text style={styles.dots}>...</Text>
        {Array.from({ length: coughs }, (_, index) => index + 1).map(
          // Create array 1..N and rendering Cough...
          this.renderCough
        )}
      </Text>
    );
  };
}

TaskManager.defineTask(TASK_STORE_AQI_HISTORY, async ({ data, error }) => {
  if (error) {
    console.log('<Loading> - TaskManager - defineTask - Error', error.message);
    return;
  }
  if (data) {
    const { locations } = data;
    const { coords } = locations[0];

    // We currently have 2 sources, aqicn, and windWaqi
    // We put them in an array
    const sources = [dataSources.aqicn, dataSources.windWaqi];

    const api = await retry(
        async (_, attempt) => {
          // Attempt starts at 1
          console.log(
              `<Loading> - fetchData - Attempt #${attempt}: ${
                  sources[(attempt - 1) % 2].name
                  }`
          );
          const result = await sources[(attempt - 1) % 2](coords);
          console.log('<Loading> - fetchData - Got result', result);

          return result;
        },
        {retries: 3} // 2 attempts per source
    );

    if (await AqiHistoryManager.isSaveNeeded()) {
      await AqiHistoryManager.saveData(api.city.name, api.rawPm25);
    }
  }
});

const styles = StyleSheet.create({
  dots: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
