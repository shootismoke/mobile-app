import React, { Component } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import { Constants } from 'expo';

import About from '../About';
import Cigarettes from '../Cigarettes';
import getCurrentPosition from './utils/getCurrentPosition';
import Header from '../Header';
import Loading from '../Loading';
import Map from '../Map';
import pm25ToCigarettes from './utils/pm25ToCigarettes';
import * as theme from '../utils/theme';

export default class Home extends Component {
  state = {
    api: null,
    gps: null,
    isAboutVisible: false,
    isMapVisible: false
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.setState({ api: null, gps: null });
      const { coords } = await getCurrentPosition();
      this.setState({ gps: coords });
      const { data: response } = await axios.get(
        `http://api.waqi.info/feed/geo:${coords.latitude};${
          coords.longitude
        }/?token=${Constants.manifest.extra.waqiToken}`,
        { timeout: 6000 }
      );
      if (response.status === 'ok') {
        this.setState({ api: response.data });
      } else {
        throw new Error(response.data);
      }
    } catch (err) {
      Alert.alert('Shit, an error!', `The error message is: ${err.message}`, [
        { text: 'Retry', onPress: () => this.fetchData() }
      ]);
    }
  }

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  handleMapHide = () => this.setState({ isMapVisible: false });

  handleMapShow = () => this.setState({ isMapVisible: true });

  handleShare = () =>
    Share.share({
      title:
        'Did you know that you may be smoking up to 20 cigarettes per day, just for living in a big city?',
      message:
        'Sh*t! I Smoke is an application that tells you how many cigarettes you smoke based on the pollution levels of your city. Download it for free here! SHITISMOKE.FIREBASEAPP.COM'
    });

  render() {
    const { api, gps, isAboutVisible, isMapVisible } = this.state;

    if (!api) {
      return <Loading api={api} gps={gps} />;
    }

    return (
      <View style={styles.container}>
        <Header api={api} hidden={!api} onLocationClick={this.handleMapShow} />

        <View style={theme.withPadding}>
          <Cigarettes api={api} />
          <View style={styles.main}>{this.renderText()}</View>
          <TouchableOpacity onPress={this.handleShare}>
            <View style={styles.share}>
              <Text style={styles.shareText}>SHARE WITH YOUR FRIENDS</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this.handleAboutShow}>
          <Text style={[styles.footer, api ? null : styles.hidden]}>
            Click to understand how we did the math.
          </Text>
        </TouchableOpacity>

        <About onRequestClose={this.handleAboutHide} visible={isAboutVisible} />
        <Map
          api={api}
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
    );
  }

  renderPresentPast = () => {
    const { api } = this.state;
    const time = api.time.s.split(' ')[1].split(':')[0];

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const { api } = this.state;
    const cigarettes = pm25ToCigarettes(api.iaqi.pm25.v);

    if (cigarettes <= 1) return 'Oh';
    if (cigarettes < 5) return 'Shit';
    if (cigarettes < 15) return 'Fuck';
    return 'WTF';
  };

  renderText = () => {
    const { api } = this.state;
    const cigarettes = pm25ToCigarettes(api.iaqi.pm25.v);

    return (
      <Text style={styles.shit}>
        {this.renderShit()}! {this.renderPresentPast()}{' '}
        <Text style={styles.cigarettesCount}>
          {cigarettes} cigarette{cigarettes === 1 ? '' : 's'}
        </Text>{' '}
        today.
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  cigarettesCount: {
    color: theme.primaryColor
  },
  container: {
    ...theme.fullScreen,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dots: {
    color: theme.primaryColor
  },
  footer: {
    ...theme.text,
    ...theme.link,
    ...theme.withPadding,
    fontSize: 13,
    marginBottom: 22,
    marginTop: 22
  },
  hidden: {
    opacity: 0
  },
  main: {
    height: 220 // Empiric
  },
  share: {
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: '90%'
  },
  shareText: {
    ...theme.title,
    color: 'white',
    ...Platform.select({
      android: {
        fontSize: 15
      },
      ios: {
        fontSize: 12
      }
    })
  },
  shit: {
    color: theme.textColor,
    fontFamily: 'gotham-black',
    fontSize: 48,
    marginTop: 23
  }
});
