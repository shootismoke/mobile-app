// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React, { PureComponent } from 'react';
import { Constants } from 'expo';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Box } from './Box';
import { BackButton } from '../../components/BackButton';
import { i18n } from '../../localization';
import * as theme from '../../utils/theme';

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

  render () {
    const { navigation } = this.props;
    return (
      <ScrollView style={theme.withPadding}>
        <BackButton onClick={navigation.pop} style={styles.backButton} />

        <View style={styles.section}>
          <Text style={styles.h2}>
            {i18n.t('about_how_do_you_calculate_the_number_of_cigarettes_title')}
          </Text>
          <Text style={theme.text}>
            {i18n.t('about_how_do_you_calculate_the_number_of_cigarettes_message_1')}{' '}
            <Text onPress={this.handleOpenArticle} style={theme.link}>
              {i18n.t('about_how_do_you_calculate_the_number_of_cigarettes_link_1')}
            </Text>
            {i18n.t('about_how_do_you_calculate_the_number_of_cigarettes_message_2')}{' '}
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
          <Text style={styles.h2}>{i18n.t('about_where_does_data_come_from_title')}</Text>
          <Text style={theme.text}>
            {i18n.t('about_where_does_data_come_from_message_1')}{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              {i18n.t('about_where_does_data_come_from_link_1')}
            </Text>{' '}
            {i18n.t('about_were_does_data_come_from_message_2')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>
            {i18n.t('about_why_is_the_station_so_far_title')}
          </Text>
          <Text style={theme.text}>
            {i18n.t('about_why_is_the_station_so_far_message')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>
            {i18n.t('about_weird_results_title')}
          </Text>
          <Text style={theme.text}>
            {i18n.t('about_weird_results_message_1')}{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              {i18n.t('about_weird_results_link_1')}
            </Text>{' '}
            {i18n.t('about_weird_results_message_2')}
          </Text>
        </View>

        <View style={styles.credits}>
          <Text style={styles.h2}>{i18n.t('about_credits_title')}</Text>
          <Text style={theme.text}>
            {i18n.t('about_credits_concept_and_development')}{' '}
            <Text onPress={this.handleOpenAmaury} style={theme.link}>
              Amaury Martiny
            </Text>
            .{'\n'}
            {i18n.t('about_credits_design_and_copywriting')}{' '}
            <Text onPress={this.handleOpenMarcelo} style={theme.link}>
              Marcelo S. Coelho
            </Text>
            .{'\n'}
            {'\n'}
            {i18n.t('about_credits_data_from')}{' '}
            <Text onPress={this.handleOpenAqi} style={theme.link}>
              WAQI
            </Text>
            .{'\n'}
            {i18n.t('about_credits_source_code')}{' '}
            <Text onPress={this.handleOpenGithub} style={theme.link}>
              {i18n.t('about_credits_available_github')}
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
    marginBottom: theme.spacing.normal,
    marginTop: theme.spacing.normal
  },
  credits: {
    borderTopColor: theme.iconBackgroundColor,
    borderTopWidth: 1,
    marginBottom: theme.spacing.normal,
    paddingTop: theme.spacing.big
  },
  h2: {
    ...theme.title,
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: theme.spacing.small
  },
  section: {
    marginBottom: theme.spacing.big
  }
});
