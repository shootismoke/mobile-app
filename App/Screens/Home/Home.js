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
import { Footer } from '../../components/Footer';
import { Header } from './Header';
import { pm25ToCigarettes } from '../../utils/pm25ToCigarettes';
import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class Home extends Component {
  goToMap = () => this.props.navigation.navigate('Map');

  handleShare = () =>
    Share.share({
      title:
        'Did you know that you may be smoking up to 20 cigarettes per day, just for living in a big city?',
      message: `Shoot! I 'smoked' ${pm25ToCigarettes(
        this.props.screenProps.api.rawPm25
      )} cigarettes today by breathing urban air. And you? Find out here: shootismoke.github.io`
    });

  render() {
    return (
      <View style={styles.container}>
        <Header onClick={this.goToMap} />
        <ScrollView bounces={false} contentContainerStyle={styles.container}>
          <View style={styles.content}>
            <Cigarettes />
            <View style={styles.main}>{this.renderText()}</View>
            <TouchableOpacity
              onPress={this.handleShare}
              style={styles.shareButton}
            >
              <View style={theme.bigButton}>
                <Text style={theme.bigButtonText}>SHARE WITH YOUR FRIENDS</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Footer style={styles.footer} />
        </ScrollView>
      </View>
    );
  }

  renderPresentPast = () => {
    const time = new Date().getHours();

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const {
      stores: {
        api: { rawPm25 }
      }
    } = this.props;
    const cigarettes = pm25ToCigarettes(rawPm25);

    if (cigarettes <= 1) return 'Oh';
    if (cigarettes < 5) return 'Sh*t';
    if (cigarettes < 15) return 'F*ck';
    return 'WTF';
  };

  renderText = () => {
    const {
      stores: {
        api: { rawPm25 }
      }
    } = this.props;
    // Round to 1 decimal
    const cigarettes = Math.round(pm25ToCigarettes(rawPm25) * 10) / 10;

    return (
      <Text style={styles.shit}>
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
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center'
  },
  dots: {
    color: theme.primaryColor
  },
  footer: {
    ...theme.withPadding
  },
  main: {
    marginBottom: 22
  },
  shareButton: {
    alignItems: 'flex-start'
  },
  shit: {
    ...theme.shitText,
    marginTop: 22
  }
});
