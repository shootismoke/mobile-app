import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import config from '../config.json';
import getCurrentPosition from './utils/getCurrentPosition';
import pm25ToCigarettes from './utils/pm25ToCigarettes';

export default class Home extends Component {
  state = {
    api: null,
    loadingApi: false,
    loadingGps: false
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ api: null, loadingGps: true });
    const { coords } = await getCurrentPosition();
    this.setState({ loadingApi: true, loadingGps: false });
    const { data: response } = await axios.get(
      `http://api.waqi.info/feed/geo:${coords.latitude};${
        coords.longitude
      }/?token=${config.waqiToken}`
    );
    this.setState({ loadingApi: false });
    if (response.status === 'ok') {
      this.setState({ api: response.data });
    } else {
      // TODO do something
    }
  }

  render() {
    const { api } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {api ? api.city.name : this.renderLoadingText()}
        </Text>

        {api ? (
          <View>
            <Text style={styles.ohShit}>
              Oh shit! I smoked{' '}
              <Text style={styles.cigarettesCount}>
                {pm25ToCigarettes(api.iaqi.pm25.v)}
              </Text>{' '}
              cigarettes today.
            </Text>
          </View>
        ) : (
          <ActivityIndicator />
        )}

        <Text style={styles.footer}>
          &#9432; The equivalence between air pollution and cigarettes smoked
          has been established by two physicists from the Berkeley Group
          foundation. Click to read more.
        </Text>
      </View>
    );
  }

  renderLoadingText = () => {
    const { loadingApi, loadingGps } = this.state;
    if (loadingGps) {
      return 'Getting GPS coordinates...';
    }
    if (loadingApi) {
      return 'Fetching air data...';
    }
  };
}

const styles = StyleSheet.create({
  cigarettesCount: {
    fontSize: 72
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 50
  },
  footer: {
    fontSize: 10
  },
  ohShit: {
    fontSize: 48
  },
  title: {
    fontSize: 24
  }
});
