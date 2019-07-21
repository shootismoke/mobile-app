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

import * as O from 'fp-ts/lib/Option';
import React, { useContext } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { Button } from '../../../components';
import { i18n } from '../../../localization';
import { AqiHistory } from '../../../managers';
import { Frequency } from '../SelectFrequency';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';

interface FooterProps extends NavigationInjectedProps {
  aqiHistory: O.Option<AqiHistory>;
  frequency: Frequency;
}

export function Footer (props: FooterProps) {
  const { aqiHistory, frequency } = props;
  const { api } = useContext(ApiContext)!;
  const { currentLocation } = useContext(CurrentLocationContext);

  const isTooFar = isStationTooFar(currentLocation!, api!);

  function goToAbout () {
    props.navigation.navigate('About');
  }

  function goToDetails () {
    props.navigation.navigate('Details');
  }

  function goToPastStations () {
    props.navigation.navigate('PastStations', {
      aqiHistory,
      frequency
    });
  }

  function handleShare () {
    return Share.share({
      title: i18n.t('home_share_title'),
      message: i18n.t('home_share_message', {
        cigarettes: api!.shootISmoke.cigarettes
      })
    });
  }

  const renderBigButton = () => {
    switch (frequency) {
      case 'daily': {
        return isTooFar ? (
          <Button onPress={goToAbout}>
            {i18n.t('home_btn_why_is_station_so_far').toUpperCase()}
          </Button>
        ) : (
          <Button onPress={goToDetails}>
            {i18n.t('home_btn_see_detailed_info').toUpperCase()}
          </Button>
        );
      }
      case 'weekly':
      case 'monthly': {
        return (
          <Button onPress={goToPastStations}>
            {i18n.t('home_btn_see_detailed_info').toUpperCase()}
          </Button>
        );
      }
    }
  };

  const renderSmallButtons = () => {
    switch (frequency) {
      case 'daily': {
        return (
          <View style={styles.smallButtons}>
            {isTooFar ? (
              <Button icon="plus-circle" onPress={goToDetails} type="secondary">
                {i18n.t('home_btn_more_details').toUpperCase()}
              </Button>
            ) : (
              <Button
                icon="question-circle"
                onPress={goToAbout}
                type="secondary"
              >
                {i18n.t('home_btn_faq_about').toUpperCase()}
              </Button>
            )}
            <Button icon="share-alt" onPress={handleShare} type="secondary">
              {i18n.t('home_btn_share').toUpperCase()}
            </Button>
          </View>
        );
      }
      case 'weekly':
      case 'monthly': {
        return (
          <View style={styles.smallButtons}>
            <Button icon="question-circle" onPress={goToAbout} type="secondary">
              {i18n.t('home_btn_faq_about').toUpperCase()}
            </Button>
            <Button icon="share-alt" onPress={handleShare} type="secondary">
              {i18n.t('home_btn_share').toUpperCase()}
            </Button>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {isTooFar && frequency === 'daily' && (
        <Text style={styles.isStationTooFar}>
          {i18n.t('home_station_too_far_message')}
        </Text>
      )}
      {renderBigButton()}
      {renderSmallButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding,
    marginBottom: theme.spacing.normal,
    marginTop: theme.spacing.tiny
  },
  isStationTooFar: {
    ...theme.text,
    marginBottom: theme.spacing.normal
  },
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.small
  }
});
