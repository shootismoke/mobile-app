import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';

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
    try {
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
        this.setState({ api: response.data });
      } else {
        throw new Error(response.data);
      }
    } catch (err) {}
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
          <TouchableOpacity onPress={this.handleMapShow}>
            <Image source={location} />
          </TouchableOpacity>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.title}>
              {api
                ? api.city.name.toUpperCase()
                : this.renderLoadingText().toUpperCase()}
            </Text>
            {api && (
              <View>
                <Text style={styles.subtitle}>
                  {/* new Date() not working in expo https://github.com/expo/expo/issues/782 */}
                  {api.time.s.split(' ')[1].slice(0, -3)} &bull;{' '}
                  {api.time.s.split(' ')[0].replace(/-/g, '/')} &bull; PM
                </Text>
              </View>
            )}
          </View>
        </View>

        {api ? (
          <View>
            <Text style={styles.shit}>
              Shit! You'll smoke{' '}
              <Text style={styles.cigarettesCount}>
                {pm25ToCigarettes(api.iaqi.pm25.v)} cigarette{pm25ToCigarettes(
                  api.iaqi.pm25.v
                ) === 1
                  ? ''
                  : 's'}
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
            Click to understand how we did the math.
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
    color: theme.primaryColor,
    fontFamily: 'gotham-black',
    fontSize: 50
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
    color: theme.secondaryTextColor,
    fontFamily: 'gotham-book',
    fontSize: 11,
    marginBottom: 22
  },
  header: {
    flexDirection: 'row'
  },
  headerTitleGroup: {
    marginLeft: 11,
    marginTop: 3
  },
  shit: {
    color: theme.textColor,
    fontFamily: 'gotham-black',
    fontSize: 50
  },
  subtitle: {
    color: theme.secondaryTextColor,
    fontFamily: 'gotham-book',
    fontSize: 10,
    letterSpacing: 0.77,
    marginTop: 11
  },
  title: {
    color: theme.textColor,
    fontSize: 12,
    fontFamily: 'gotham-black',
    letterSpacing: 3.14
  }
});
