// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
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
          <Text style={styles.h2}>About</Text>
          <Text style={[theme.text, theme.paragraph]}>
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
          <Text style={styles.h2}>About</Text>
          <Text style={[theme.text, theme.paragraph]}>HELLO</Text>
        </View>

        <View style={styles.credits}>
          <Text style={styles.h2}>Credits</Text>
          <Text style={[theme.text, theme.paragraph]}>
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
    lineHeight: 44
  },
  section: {
    marginBottom: theme.defaultSpacing
  }
});
