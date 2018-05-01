import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import pinIcon from '../../../../assets/images/location.png';
import * as theme from '../../../utils/theme';

export default class Item extends Component {
  handleClick = () => {
    const {
      item: { city, country, county, _geoloc, locale_names },
      onClick
    } = this.props;
    onClick({
      latitude: _geoloc.lat,
      longitude: _geoloc.lng,
      name: [
        locale_names[0],
        city,
        county && county.length ? county[0] : null,
        country
      ]
        .filter(_ => _)
        .join(', ')
    });
  };

  render() {
    const {
      item: { administrative, city, country, county, locale_names }
    } = this.props;
    return (
      <TouchableOpacity onPress={this.handleClick} style={styles.container}>
        <Image source={pinIcon} />
        <View style={styles.result}>
          <Text style={styles.title}>{locale_names[0]}</Text>
          <Text style={styles.description}>
            {[city, county && county.length ? county[0] : null, country]
              .filter(_ => _)
              .join(', ')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 17
  },
  description: {
    ...theme.text,
    marginTop: 4
  },
  result: {
    marginLeft: 17
  },
  title: {
    ...theme.title
  }
});
