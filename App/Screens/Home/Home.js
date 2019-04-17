// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Cigarettes } from './Cigarettes';
import { Header } from './Header';
import { i18n } from '../../localization';
import { SmallButton } from './SmallButton';
import { SmokeVideo } from './SmokeVideo';
import swearWords from './swearWords';
import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class Home extends Component {
  goToAbout = () => this.props.navigation.navigate('About');

  goToDetails = () => this.props.navigation.navigate('Details');

  goToSearch = () => this.props.navigation.navigate('Search');

  handleShare = () =>
    Share.share({
      title: i18n.t('home_share_title'),
      message: i18n.t('home_share_message', { cigarettes: this.props.stores.cigarettes })
    });

  render () {
    const {
      stores: { isStationTooFar }
    } = this.props;
    return (
      <View style={styles.container}>
        <SmokeVideo />
        <Header onChangeLocationClick={this.goToSearch} />
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <View style={styles.content}>
            <Cigarettes />
            <View style={styles.main}>{this.renderText()}</View>
          </View>
          <View style={styles.cta}>
            {isStationTooFar && (
              <Text style={styles.isStationTooFar}>
                {i18n.t('home_station_too_far_message')}
              </Text>
            )}
            {this.renderBigButton()}
            {this.renderFooter()}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderBigButton = () => {
    const {
      stores: { isStationTooFar }
    } = this.props;
    if (isStationTooFar) {
      return (
        <TouchableOpacity onPress={this.goToAbout}>
          <View style={theme.bigButton}>
            <Text style={theme.bigButtonText}>{i18n.t('home_btn_why_is_station_so_far').toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.goToDetails}>
        <View style={theme.bigButton}>
          <Text style={theme.bigButtonText}>{i18n.t('home_btn_see_detailed_info').toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const {
      stores: { isStationTooFar }
    } = this.props;
    return (
      <View style={styles.smallButtons}>
        {isStationTooFar ? (
          <SmallButton
            icon='plus-circle'
            text={i18n.t('home_btn_more_details').toUpperCase()}
            onPress={this.goToDetails}
          />
        ) : (
          <SmallButton
            icon='question-circle'
            text={i18n.t('home_btn_faq_about').toUpperCase()}
            onPress={this.goToAbout}
          />
        )}
        <SmallButton icon='share-alt' text={i18n.t('home_btn_share').toUpperCase()} onPress={this.handleShare} />
      </View>
    );
  };

  renderPresentPast = () => {
    const time = new Date().getHours();

    if (time < 15) return i18n.t('home_common_you_ll_smoke');
    return i18n.t('home_common_you_smoked');
  };

  renderShit = () => {
    const {
      stores: { cigarettes }
    } = this.props;

    if (cigarettes <= 1) return i18n.t('home_common_oh');

    // Return a random swear word
    return swearWords[Math.floor(Math.random() * swearWords.length)];
  };

  renderText = () => {
    const { stores } = this.props;
    // Round to 1 decimal
    const cigarettes = Math.round(stores.cigarettes * 10) / 10;

    const text = i18n.t('home_smoked_cigarette_title', {
      swearWord: this.renderShit(),
      presentPast: this.renderPresentPast(),
      singularPlural: cigarettes === 1 ? i18n.t('home_common_cigarette').toLowerCase() : i18n.t('home_common_cigarettes').toLowerCase(),
      cigarettes
    });

    const firstPartText = text.split('<')[0];
    const secondPartText = text.split('<')[1];

    return (
      <Text adjustsFontSizeToFit style={styles.shit}>
        {firstPartText}
        <Text style={styles.cigarettesCount}>
          {secondPartText.split('>')[0]}
        </Text>
        {secondPartText.split('>')[1]}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  cigarettesCount: {
    color: theme.primaryColor
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  content: {
    ...theme.withPadding,
    justifyContent: 'center',
    marginTop: theme.spacing.normal
  },
  cta: {
    ...theme.withPadding,
    marginTop: theme.spacing.normal
  },
  dots: {
    color: theme.primaryColor
  },
  isStationTooFar: {
    ...theme.text,
    marginBottom: theme.spacing.normal
  },
  main: {
    marginBottom: theme.spacing.normal
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  scrollView: { flex: 1 },
  shit: {
    ...theme.shitText,
    marginTop: theme.spacing.normal
  },
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2 * theme.spacing.normal,
    marginTop: theme.spacing.normal
  }
});
