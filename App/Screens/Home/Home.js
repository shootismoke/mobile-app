// Copyright (c) 2018, Amaury Martiny
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
      title:
        'Did you know that you may be smoking up to 20 cigarettes per day, just for living in a big city?',
      message: `Shoot! I 'smoked' ${
        this.props.stores.cigarettes
      } cigarettes today by breathing urban air. And you? Find out here: https://shootismoke.github.io`
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
          <View />
          <View style={styles.content}>
            <Cigarettes />
            <View style={styles.main}>{this.renderText()}</View>
          </View>
          <View style={styles.cta}>
            {isStationTooFar && (
              <Text style={styles.isStationTooFar}>
                We couldn’t find a closer station to you.{'\n'}Results may be
                inaccurate at this distance.
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
            <Text style={theme.bigButtonText}>WHY IS THE STATION SO FAR?</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.goToDetails}>
        <View style={theme.bigButton}>
          <Text style={theme.bigButtonText}>SEE DETAILED INFO</Text>
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
            text='MORE DETAILS'
            onPress={this.goToDetails}
          />
        ) : (
          <SmallButton
            icon='question-circle'
            text='FAQ/ABOUT'
            onPress={this.goToAbout}
          />
        )}
        <SmallButton icon='share-alt' text='SHARE' onPress={this.handleShare} />
      </View>
    );
  };

  renderPresentPast = () => {
    const time = new Date().getHours();

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const {
      stores: { cigarettes }
    } = this.props;

    if (cigarettes <= 1) return 'Oh';

    // Return a random swear word
    return swearWords[Math.floor(Math.random() * swearWords.length)];
  };

  renderText = () => {
    const { stores } = this.props;
    // Round to 1 decimal
    const cigarettes = Math.round(stores.cigarettes * 10) / 10;

    return (
      <Text adjustsFontSizeToFit style={styles.shit}>
        {this.renderShit()}! {this.renderPresentPast()}{' '}
        <Text style={styles.cigarettesCount}>
          {cigarettes} cigarette
          {cigarettes === 1 ? '' : 's'}
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
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  content: {
    ...theme.withPadding,
    justifyContent: 'center'
  },
  cta: {
    ...theme.withPadding
  },
  dots: {
    color: theme.primaryColor
  },
  isStationTooFar: {
    ...theme.text,
    marginVertical: theme.spacing.normal
  },
  main: {
    marginBottom: theme.spacing.normal
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-around'
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
