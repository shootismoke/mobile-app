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

import backIcon from '../../../assets/images/back.png';
import * as theme from '../../utils/theme';
import { i18n } from '../../localization';

export class BackButton extends PureComponent {
  onClick = () => this.props.onClick();

  render () {
    const { style } = this.props;

    return (
      <View style={style}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={this.onClick}
          style={styles.backButton}
        >
          <Image source={backIcon} />
          <Text style={styles.backText}>{i18n.t('nav_btn_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  backText: {
    ...theme.text,
    marginLeft: 9
  }
});
