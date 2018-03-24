import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import format from 'date-fns/format';

import About from '../About';
import config from '../config.json';
import getCurrentPosition from './utils/getCurrentPosition';
import location from '../../assets/images/location.png';
import Map from '../Map';
import pm25ToCigarettes from './utils/pm25ToCigarettes';
import * as theme from '../utils/theme';

export default class Home extends Component {
  state = {
    api: null,
    gps: null,
    isAboutVisible: false,
    isMapVisible: false,
    loadingApi: false,
    loadingGps: false
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ api: null, loadingGps: true });
    const { coords } = await getCurrentPosition();
    this.setState({ gps: coords, loadingApi: true, loadingGps: false });
    const { data: response } = await axios.get(
      `http://api.waqi.info/feed/geo:${coords.latitude};${
        coords.longitude
      }/?token=${config.waqiToken}`
    );
    this.setState({ loadingApi: false });
    if (response.status === 'ok') {
      console.log(response.data.time.s);
      this.setState({ api: response.data });
    } else {
      // TODO do something
    }
  }

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  handleMapHide = () => this.setState({ isMapVisible: false });

  handleMapShow = () => this.setState({ isMapVisible: true });

  render() {
    const { api, gps, isAboutVisible, isMapVisible } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            <TouchableOpacity onPress={this.handleMapShow}>
              <Image source={location} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {api
                ? api.city.name.toUpperCase()
                : this.renderLoadingText().toUpperCase()}
            </Text>
          </View>
          {api && (
            <View>
              <Text style={styles.subtitle}>
                {format(new Date(api.time.s), 'h:mma')}
              </Text>
            </View>
          )}
        </View>

        {api ? (
          <View>
            <Text style={styles.ohShit}>
              Shit! You'll smoke{' '}
              <Text style={styles.cigarettesCount}>
                {pm25ToCigarettes(api.iaqi.pm25.v)} cigarettes
              </Text>{' '}
              today.
            </Text>
            <Map
              gps={gps}
              station={{
                description: api.attributions.length
                  ? api.attributions[0].name
                  : null,
                latitude: api.city.geo[0],
                longitude: api.city.geo[1],
                title: api.city.name
              }}
              onRequestClose={this.handleMapHide}
              visible={isMapVisible}
            />
          </View>
        ) : (
          <ActivityIndicator />
        )}

        <TouchableOpacity onPress={this.handleAboutShow}>
          <Text style={styles.footer}>
            Click here to understand how we did the math.
          </Text>
        </TouchableOpacity>

        <About onRequestClose={this.handleAboutHide} visible={isAboutVisible} />
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
    return '';
  };
}

const styles = StyleSheet.create({
  cigarettesCount: {
    fontFamily: 'gotham-black',
    fontSize: 64
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 17,
    paddingTop: 50
  },
  footer: {
    color: theme.primaryColor,
    fontSize: 11,
    marginBottom: 21,
    textDecorationLine: 'underline'
  },
  headerTitleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 11
  },
  ohShit: {
    fontFamily: 'gotham-black',
    fontSize: 48
  },
  subtitle: {
    marginLeft: 50,
    marginTop: 11
  },
  title: {
    color: theme.textColor,
    fontFamily: 'helvetica-regular',
    fontSize: 18,
    marginLeft: 11,
    letterSpacing: 3.14
  }
});
