import React, { Component } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import searchIcon from '../../../../assets/images/search.png';
import * as theme from '../../../utils/theme';

export default class SearchHeader extends Component {
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
    const { onChangeSearch, search, ...rest } = this.props;
    return (
      <View onPress={this.handleClick} style={styles.container}>
        <View style={styles.header}>
          <TextInput
            autoFocus
            onChangeText={onChangeSearch}
            placeholder="Search for a city or address"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            style={styles.input}
            value={search}
            {...rest}
          />
          <Image source={searchIcon} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    ...theme.withPadding,
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    flexDirection: 'row',
    height: 48
  },
  input: {
    ...theme.text,
    color: 'white',
    flexGrow: 1,
    fontSize: 16
  }
});
