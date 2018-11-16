// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
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
import { Header } from '../../components/Header';
import { pm25ToCigarettes } from '../../utils/pm25ToCigarettes';
import * as theme from '../../utils/theme';

export class Home extends Component {
  static navigationOptions = {
    header: props => {
      return (
        <Header
          {...props.screenProps}
          onClick={() => props.navigation.navigate('Map')} // TODO Possible not to create a new function every time?
          showChangeLocation
        />
      );
    }
  };

  goToMap = () => this.props.navigation.navigate('Map');

  handleShare = () =>
    Share.share({
      title:
        'Did you know that you may be smoking up to 20 cigarettes per day, just for living in a big city?',
      message: `Shoot! I 'smoked' ${pm25ToCigarettes(
        this.props.screenProps.api.pm25
      )} cigarettes today by breathing urban air. And you? Find out here: shootismoke.github.io`
    });

  render() {
    const {
      screenProps: {
        api: { pm25 }
      }
    } = this.props;
    return (
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Cigarettes pm25={pm25} />
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
    );
  }

  renderPresentPast = () => {
    const time = new Date().getHours();

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const {
      screenProps: {
        api: { pm25 }
      }
    } = this.props;
    const cigarettes = pm25ToCigarettes(pm25);

    if (cigarettes <= 1) return 'Oh';
    if (cigarettes < 5) return 'Sh*t';
    if (cigarettes < 15) return 'F*ck';
    return 'WTF';
  };

  renderText = () => {
    const {
      screenProps: {
        api: { pm25 }
      }
    } = this.props;
    // Round to 1 decimal
    const cigarettes = Math.round(pm25ToCigarettes(pm25) * 10) / 10;

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
