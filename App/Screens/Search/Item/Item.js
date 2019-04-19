// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import pinIcon from '../../../../assets/images/location.png';
import * as theme from '../../../utils/theme';

export class Item extends PureComponent {
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

  render () {
    const {
      item: { city, country, county, locale_names: localeNames }
    } = this.props;
    return (
      <TouchableOpacity onPress={this.handleClick} style={styles.container}>
        <Image source={pinIcon} />
        <View style={styles.result}>
          <Text style={styles.title}>{localeNames[0]}</Text>
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
