import React, { Component } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import { Constants } from 'expo';
import retry from 'async-retry';

import Cigarettes from './Cigarettes';
import Footer from '../../Footer';
import Header from '../../Header';
import getCurrentPosition from '../../utils/getCurrentPosition';
import pm25ToCigarettes from '../../utils/pm25ToCigarettes';
import * as theme from '../../utils/theme';

export default class Home extends Component {
  static navigationOptions = {
    header: props => {
      return (
        <Header
          {...props.screenProps}
          onClick={() => props.navigation.navigate('Map')}
        />
      );
    }
  };

  goToMap = () => this.props.navigation.navigate('Map');

  handleShare = () =>
    Share.share({
      title:
        'Did you know that you may be smoking up to 20 cigarettes per day, just for living in a big city?',
      message:
        'Sh*t! I Smoke is an application that tells you how many cigarettes you smoke based on the pollution levels of your city. Download it for free here! shitismoke.github.io'
    });

  render() {
    const {
      screenProps: { api }
    } = this.props;
    return (
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={theme.withPadding}>
          <Cigarettes api={api} />
          <View style={styles.main}>{this.renderText()}</View>
          <TouchableOpacity onPress={this.handleShare}>
            <View style={styles.share}>
              <Text style={styles.shareText}>SHARE WITH YOUR FRIENDS</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Footer style={styles.footer} />
      </ScrollView>
    );
  }

  renderPresentPast = () => {
    const {
      screenProps: { api }
    } = this.props;
    const time = new Date().getHours();

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const {
      screenProps: { api }
    } = this.props;
    const cigarettes = pm25ToCigarettes(api);

    if (cigarettes <= 1) return 'Oh';
    if (cigarettes < 5) return 'Sh*t';
    if (cigarettes < 15) return 'F*ck';
    return 'WTF';
  };

  renderText = () => {
    const {
      screenProps: { api }
    } = this.props;
    const cigarettes = pm25ToCigarettes(api);

    return (
      <Text style={styles.shit}>
        {this.renderShit()}! {this.renderPresentPast()}{' '}
        <Text style={styles.cigarettesCount}>
          {cigarettes} cigarette{cigarettes === 1 ? '' : 's'}
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
    ...theme.fullScreen,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dots: {
    color: theme.primaryColor
  },
  footer: {
    ...theme.withPadding
  },
  main: {
    height: 220 // Empiric
  },
  share: {
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: '90%'
  },
  shareText: {
    ...theme.title,
    color: 'white',
    ...Platform.select({
      android: {
        fontSize: 15
      },
      ios: {
        fontSize: 12
      }
    })
  },
  shit: {
    ...theme.shitText,
    marginTop: 22
  }
});
