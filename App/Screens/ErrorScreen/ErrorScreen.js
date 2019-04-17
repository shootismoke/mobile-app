// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import error from '../../../assets/images/error.png';
import * as theme from '../../utils/theme';
import { i18n } from '../../localization';

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
