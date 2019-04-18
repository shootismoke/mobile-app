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

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import error from '../../../assets/images/error.png';
import { i18n } from '../../localization';
import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class ErrorScreen extends Component {
  goToSearch = () => this.props.navigation.navigate('Search');

  render () {
    const { error: errorText } = this.props.stores;

    return (
      <View style={styles.container}>
        <Image source={error} />
        <View>
          <Text style={styles.errorText}>
            <Text style={styles.sorry}>{i18n.t('error_screen_common_sorry')}</Text>
            {i18n.t('error_screen_error_cannot_load_cigarettes')}
          </Text>
        </View>
        <TouchableOpacity onPress={this.goToSearch}>
          <View style={styles.chooseOther}>
            <Text style={theme.bigButtonText}>{i18n.t('error_screen_choose_other_location').toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
        <Text style={theme.text}>
          {i18n.t('error_screen_error_description')}
        </Text>
        <Text style={styles.errorMessage}>{i18n.t('error_screen_error_message', { errorText })}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chooseOther: {
    ...theme.bigButton,
    marginVertical: theme.spacing.normal
  },
  container: {
    ...theme.fullScreen,
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column'
  },
  errorMessage: {
    ...theme.text,
    fontSize: 10,
    marginTop: theme.spacing.small
  },
  errorText: {
    ...theme.shitText,
    marginTop: theme.spacing.big
  },
  sorry: {
    color: theme.primaryColor
  }
});
