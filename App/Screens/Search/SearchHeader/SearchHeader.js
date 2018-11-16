// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Image, StyleSheet, TextInput } from 'react-native';

import { Banner } from '../../../components/Banner';
import searchIcon from '../../../../assets/images/search.png';
import * as theme from '../../../utils/theme';

export class SearchHeader extends Component {
  handleClick = () => {
    const {
      item: { city, country, county, _geoloc, locale_names: localeNames },
      onClick
    } = this.props;
    onClick({
      latitude: _geoloc.lat,
      longitude: _geoloc.lng,
      name: [
        localeNames[0],
        city,
        county && county.length ? county[0] : null,
        country
      ]
        .filter(_ => _)
        .join(', ')
    });
  };

  render() {
    const { onChangeSearch, search } = this.props;
    return (
      <Banner elevated shadowPosition="bottom">
        <TextInput
          autoFocus
          onChangeText={onChangeSearch}
          placeholder="Search for a city or address"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          style={styles.input}
          underlineColorAndroid="transparent"
          value={search}
        />
        <Image source={searchIcon} />
      </Banner>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor
  },
  content: {
    ...theme.withPadding,
    alignItems: 'center',
    flexDirection: 'row',
    height: 48
  },
  input: {
    ...theme.text,
    color: 'white',
    flexGrow: 1,
    fontSize: 13
  }
});
