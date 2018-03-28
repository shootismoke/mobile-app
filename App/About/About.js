import React, { Component } from 'react';
import { Constants } from 'expo';
import {
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import back from '../../assets/images/back.png';
import cigarette from '../../assets/images/cigarette.png';
import * as theme from '../utils/theme';

export default class About extends Component {
  handleOpenAmaury = () => Linking.openURL('https://twitter.com/amaurymartiny');

  handleOpenArticle = () =>
    Linking.openURL(
      'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
    );

  handleOpenGithub = () => Linking.openURL(Constants.manifest.extra.githubUrl);

  handleOpenMarcelo = () =>
    Linking.openURL('https://www.behance.net/marceloscoelho');

  render() {
    const { onRequestClose, ...rest } = this.props;

    return (
      <Modal animationType="slide" onRequestClose={onRequestClose} {...rest}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={onRequestClose}
              style={styles.backButton}
            >
              <Image source={back} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={theme.withPadding}>
            <View style={styles.about}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.aboutDescription}>
                This app was inspired by Berkeley Earth’s findings about the{' '}
                <Text onPress={this.handleOpenArticle} style={theme.link}>
                  equivalence between air pollution and cigarette smoking
                </Text>. The rule of thumb is simple: one cigarette per day is
                the rough equivalent of a PM2.5 level of 22{' '}
                <Text style={styles.micro}>&micro;</Text>g/m&sup3;
                {' \u207D'}&sup1;{'\u207E'}.
              </Text>
              <View style={styles.box}>
                <View style={styles.equivalence}>
                  <View style={styles.statisticsLeft}>
                    <Image source={cigarette} style={styles.cigarette} />
                    <Text style={styles.value}> </Text>
                    <Text style={styles.label}>per day</Text>
                  </View>
                  <Text style={styles.equal}>=</Text>
                  <View style={styles.statisticsRight}>
                    <Text style={styles.value}>22</Text>
                    <Text style={styles.label}>
                      <Text style={styles.micro}>&micro;</Text>g/m&sup3; PM2.5*
                    </Text>
                  </View>
                </View>
                <Text style={styles.boxDescription}>
                  *Atmospheric particulate matter (PM) that have a diameter of
                  less than 2.5 micrometers, with increased chances of
                  inhalation by living beings.
                </Text>
              </View>
              <Text style={styles.articleLink}>
                (1){' '}
                <Text onPress={this.handleOpenArticle} style={theme.link}>
                  http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
                </Text>
              </Text>
            </View>
            <View style={styles.credits}>
              <Text style={styles.creditsTitle}>Credits</Text>
              <Text style={styles.creditsDescription}>
                Concept &amp; Development by{' '}
                <Text onPress={this.handleOpenAmaury} style={theme.link}>
                  Amaury Martiny
                </Text>.{'\n'}
                Design &amp; Copy by{' '}
                <Text onPress={this.handleOpenMarcelo} style={theme.link}>
                  Marcelo S. Coelho
                </Text>.{'\n'}
                {'\n'}
                <Text onPress={this.handleOpenGithub} style={theme.link}>
                  Available on Github
                </Text>.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  about: {},
  aboutDescription: {
    ...theme.text
  },
  aboutTitle: {
    ...theme.title,
    fontSize: 36,
    marginBottom: 12
  },
  articleLink: {
    ...theme.text,
    fontSize: 8
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  backText: {
    color: theme.secondaryTextColor,
    fontFamily: 'gotham-book',
    fontSize: 14,
    marginLeft: 9
  },
  box: {
    alignItems: 'center',
    borderColor: '#EAEAEA',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 10,
    padding: 10
  },
  boxDescription: {
    ...theme.text,
    fontSize: 9,
    lineHeight: 16,
    marginTop: 15
  },
  cigarette: {
    left: 16,
    position: 'absolute'
  },
  container: {
    ...theme.fullScreen,
    ...theme.modal,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  credits: {
    marginBottom: 22,
    marginTop: 22
  },
  creditsDescription: {
    ...theme.text
  },
  creditsTitle: {
    ...theme.title,
    fontSize: 20,
    marginBottom: 12
  },
  equal: {
    ...theme.text,
    color: theme.secondaryTextColor,
    fontSize: 44,
    lineHeight: 44,
    marginHorizontal: 18
  },
  equivalence: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  header: {
    ...theme.withPadding,
    marginTop: 23,
    marginBottom: 23
  },
  label: {
    ...theme.title,
    color: theme.secondaryTextColor,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  micro: {
    ...Platform.select({
      ios: {
        fontFamily: 'Georgia'
      },
      android: {
        fontFamily: 'normal'
      }
    })
  },
  statisticsLeft: {
    alignItems: 'flex-end',
    paddingRight: 10,
    width: 90
  },
  statisticsRight: {
    alignItems: 'center',
    width: 90
  },
  value: {
    ...theme.text,
    color: theme.secondaryTextColor,
    fontSize: 44,
    lineHeight: 44
  }
});
