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

import Constants from 'expo-constants';
import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { NavigationInjectedProps } from 'react-navigation';

import { Box } from './Box';
import { BackButton } from '../../components';
import { Dev } from './Dev';
import { i18n } from '../../localization';
import * as theme from '../../util/theme';

interface AboutProps extends NavigationInjectedProps {}

export function About (props: AboutProps) {
  const handleOpenAmaury = () =>
    Linking.openURL('https://twitter.com/amaurymartiny');

  const handleOpenAqi = () => Linking.openURL('http://aqicn.org/');

  const handleOpenArticle = () =>
    Linking.openURL(
      'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
    );

  const handleOpenGithub = () =>
    Linking.openURL(Constants.manifest.extra.githubUrl);

  const handleOpenMarcelo = () =>
    Linking.openURL('https://www.behance.net/marceloscoelho');

  const { navigation } = props;
  return (
    <ScrollView style={theme.withPadding}>
      <BackButton onPress={() => navigation.pop()} style={styles.backButton} />

      <View style={styles.section}>
        <Text style={styles.h2}>
          {i18n.t('about_how_do_you_calculate_the_number_of_cigarettes_title')}
        </Text>
        <Text style={theme.text}>
          {i18n.t(
            'about_how_do_you_calculate_the_number_of_cigarettes_message_1'
          )}{' '}
          <Text onPress={handleOpenArticle} style={theme.link}>
            {i18n.t(
              'about_how_do_you_calculate_the_number_of_cigarettes_link_1'
            )}
          </Text>
          {i18n.t(
            'about_how_do_you_calculate_the_number_of_cigarettes_message_2'
          )}
          <Text style={styles.micro}>&micro;</Text>
          g/m&sup3;
          {' \u207D'}
          &sup1;
          {'\u207E'}.
        </Text>
        <Box />
        <Text style={styles.articleLink}>
          (1){' '}
          <Text onPress={handleOpenArticle} style={theme.link}>
            http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.h2}>
          {i18n.t('about_where_does_data_come_from_title')}
        </Text>
        <Text style={theme.text}>
          {i18n.t('about_where_does_data_come_from_message_1')}{' '}
          <Text onPress={handleOpenAqi} style={theme.link}>
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
        <Text style={styles.h2}>{i18n.t('about_weird_results_title')}</Text>
        <Text style={theme.text}>
          {i18n.t('about_weird_results_message_1')}{' '}
          <Text onPress={handleOpenAqi} style={theme.link}>
            {i18n.t('about_weird_results_link_1')}
          </Text>{' '}
          {i18n.t('about_weird_results_message_2')}
        </Text>
      </View>

      <View style={styles.credits}>
        <Text style={styles.h2}>{i18n.t('about_credits_title')}</Text>
        <Text style={theme.text}>
          {i18n.t('about_credits_concept_and_development')}{' '}
          <Text onPress={handleOpenAmaury} style={theme.link}>
            Amaury Martiny
          </Text>
          .{'\n'}
          {i18n.t('about_credits_design_and_copywriting')}{' '}
          <Text onPress={handleOpenMarcelo} style={theme.link}>
            Marcelo S. Coelho
          </Text>
          .{'\n'}
          {'\n'}
          {i18n.t('about_credits_data_from')}{' '}
          <Text onPress={handleOpenAqi} style={theme.link}>
            WAQI
          </Text>
          .{'\n'}
          {i18n.t('about_credits_source_code')}{' '}
          <Text onPress={handleOpenGithub} style={theme.link}>
            {i18n.t('about_credits_available_github')}
          </Text>
          .{'\n'}
          {'\n'}
          Shoot! I Smoke v{Constants.manifest.version}.
        </Text>
        {/* Add languages https://github.com/amaurymartiny/shoot-i-smoke/issues/73 */}
      </View>
      <Dev />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  articleLink: {
    ...theme.text,
    fontSize: scale(8)
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
    fontSize: scale(20),
    letterSpacing: 0,
    lineHeight: scale(24),
    marginBottom: theme.spacing.small
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
  section: {
    marginBottom: theme.spacing.big
  }
});
