// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { PureComponent } from 'react';
import { Constants } from 'expo';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Box } from './Box';
import * as theme from '../../utils/theme';
import { BackButton } from '../../components/BackButton';

export class About extends PureComponent {
  handleOpenAmaury = () => Linking.openURL('https://twitter.com/amaurymartiny');

  handleOpenAqi = () => Linking.openURL('http://aqicn.org/');

  handleOpenArticle = () =>
    Linking.openURL(
      'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
    );

  handleOpenGithub = () => Linking.openURL(Constants.manifest.extra.githubUrl);

  handleOpenMarcelo = () =>
    Linking.openURL('https://www.behance.net/marceloscoelho');

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={theme.withPadding}>
        <BackButton onClick={navigation.pop} style={styles.backButton} />

        <View style={styles.section}>
          <Text style={styles.h2}>
            How do you calculate the number of cigarettes?
          </Text>
          <Text style={theme.text}>
            This app was inspired by Berkeley Earth’s findings about the{' '}
            <Text onPress={this.handleOpenArticle} style={theme.link}>
              equivalence between air pollution and cigarette smoking
            </Text>
            . The rule of thumb is simple: one cigarette per day is the rough
            equivalent of a PM2.5 level of 22{' '}
            <Text style={styles.micro}>&micro;</Text>
            g/m&sup3;
            {' \u207D'}
            &sup1;
            {'\u207E'}.
          </Text>
          <Box />
          <Text style={styles.articleLink}>
            (1){' '}
            <Text onPress={this.handleOpenArticle} style={theme.link}>
              http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Where does the data come from?</Text>
          <Text style={theme.text}>
            Air quality data comes from{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              WAQI
            </Text>{' '}
            in the form of PM2.5 AQI levels which are usually updated every one
            hour and converted to direct PM2.5 levels by the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>
            Why is the station so far away from my current location?
          </Text>
          <Text style={theme.text}>
            Since stations that measure and communicate Air Quality results
            every hour are expensive, the data is still limited to
            well-developed regions and larger cities around the globe. If you
            are far from a more prominent urban center, results will probably
            not be so accurate. Chances are that your air is better in that case
            at least!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>
            The results are weird or inconsistent with other sources!
          </Text>
          <Text style={theme.text}>
            We have also encountered a few surprising results: large cities with
            better air than small villages; sudden huge increases in the number
            of cigarettes; stations of the same town showing significantly
            different numbers... The fact is air quality depends on several
            factors such as temperature, pressure, humidity and even wind
            direction and intensity. If the result seems weird for you, check{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              WAQI
            </Text>{' '}
            for more information and history on your station.
          </Text>
        </View>

        <View style={styles.credits}>
          <Text style={styles.h2}>Credits</Text>
          <Text style={theme.text}>
            Concept &amp; Development by{' '}
            <Text onPress={this.handleOpenAmaury} style={theme.link}>
              Amaury Martiny
            </Text>
            .{'\n'}
            Design &amp; Copywriting by{' '}
            <Text onPress={this.handleOpenMarcelo} style={theme.link}>
              Marcelo S. Coelho
            </Text>
            .{'\n'}
            {'\n'}
            Air quality data from{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              WAQI
            </Text>
            .{'\n'}
            Source code{' '}
            <Text onPress={this.handleOpenGithub} style={theme.link}>
              available on Github
            </Text>
            .{'\n'}
            {'\n'}
            Shoot! I Smoke v{Constants.manifest.version}.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  articleLink: {
    ...theme.text,
    fontSize: 8
  },
  backButton: {
    marginBottom: theme.defaultSpacing,
    marginTop: theme.defaultSpacing
  },
  credits: {
    borderTopColor: theme.iconBackgroundColor,
    borderTopWidth: 1,
    marginBottom: theme.defaultSpacing,
    marginTop: theme.defaultSpacing,
    paddingTop: 2 * theme.defaultSpacing
  },
  h2: {
    ...theme.title,
    fontSize: 32,
    lineHeight: 36
  },
  section: {
    marginBottom: theme.defaultSpacing
  }
});
