// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
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

  render() {
    return (
      <View style={styles.container}>
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
          <Text style={theme.bigButtonText}>SEE DETAILS</Text>
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
          <SmallButton text="MORE DETAILS" onPress={this.goToDetails} />
        ) : (
          <SmallButton text="ABOUT" onPress={this.goToAbout} />
        )}
        <SmallButton text="SHARE" onPress={this.handleShare} />
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
    if (cigarettes < 5) return 'Sh*t';
    if (cigarettes < 15) return 'F*ck';
    return 'WTF';
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
    alignItems: 'center'
  },
  dots: {
    color: theme.primaryColor
  },
  main: {
    marginBottom: theme.defaultSpacing
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-around'
  },
  scrollView: { flex: 1 },
  shit: {
    ...theme.shitText,
    marginTop: theme.defaultSpacing
  },
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2 * theme.defaultSpacing,
    marginTop: theme.defaultSpacing
  }
});
