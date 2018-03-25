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

import location from '../../assets/images/location.png';
import Map from '../Map';
import * as theme from '../utils/theme';

export default class Header extends Component {
  state = {
    api: null
  };

  render() {
    const { api, onLocationClick } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <TouchableOpacity disabled={!api} onPress={onLocationClick}>
            <Image source={location} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {api
              ? api.city.name.toUpperCase()
              : this.renderLoadingText().toUpperCase()}
          </Text>
        </View>
        {api && (
          <View style={styles.subtitleGroup}>
            <Text style={styles.subtitle}>
              {/* new Date() not working in expo https://github.com/expo/expo/issues/782 */}
              {api.time.s.split(' ')[1].slice(0, -3)} &bull;{' '}
              {api.time.s.split(' ')[0].replace(/-/g, '/')}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderLoadingText = () => {
    const { loadingApi, loadingGps } = this.props;
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
  header: {
    marginTop: 23,
    marginBottom: 25,
    paddingHorizontal: 17
  },
  titleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 3
  },
  subtitle: {
    ...theme.text,
    fontSize: 10,
    marginLeft: 33, // Picutre width (22) + marginleft (11)
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 12,
    letterSpacing: 3.14,
    marginLeft: 11
  }
});
