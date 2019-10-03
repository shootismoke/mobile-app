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

import React, { useContext } from 'react';
import { Platform, Share, StyleSheet, View, ViewProps } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { aboutSections } from '../../About';
import { Button } from '../../../components';
import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { track } from '../../../util/amplitude';
import { isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';

interface FooterProps extends NavigationInjectedProps, ViewProps {}

export function Footer (props: FooterProps) {
  const { api } = useContext(ApiContext)!;
  const { currentLocation } = useContext(CurrentLocationContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { navigation, style, ...rest } = props;

  const isTooFar = isStationTooFar(currentLocation!, api!);

  function goToAbout () {
    track('HOME_SCREEN_ABOUT_CLICK');
    navigation.navigate('About');
  }

  function goToAboutWhySoFar () {
    track('HOME_SCREEN_ABOUT_WHY_SO_FAR_CLICK');
    navigation.navigate('About', {
      scrollInto: aboutSections.aboutWhyIsTheStationSoFarTitle
    });
  }

  function goToDetails () {
    track('HOME_SCREEN_DETAILS_CLICK');
    navigation.navigate('Details');
  }

  function handleShare () {
    track('HOME_SCREEN_SHARE_CLICK');

    // Share doesn't currently support images on Android, so the text version
    if (Platform.OS === 'ios') {
      props.navigation.navigate('ShareModal');
    } else {
      Share.share({
        title: i18n.t('home_share_title'),
        message: i18n.t('home_share_message', {
          cigarettes: api!.shootISmoke.cigarettes.toFixed(2)
        })
      });
    }
  }

  const renderBigButton = () => {
    return isTooFar ? (
      <Button onPress={goToAboutWhySoFar}>
        {i18n.t('home_btn_why_is_station_so_far').toUpperCase()}
      </Button>
    ) : (
      <Button onPress={goToDetails}>
        {i18n.t('home_btn_see_detailed_info').toUpperCase()}
      </Button>
    );
  };

  const renderSmallButtons = () => {
    return (
      <View style={styles.smallButtons}>
        {isTooFar ? (
          <Button icon="plus-circle" onPress={goToDetails} type="secondary">
            {i18n.t('home_btn_more_details').toUpperCase()}
          </Button>
        ) : (
          <Button icon="question-circle" onPress={goToAbout} type="secondary">
            {i18n.t('home_btn_faq_about').toUpperCase()}
          </Button>
        )}
        <Button icon="share-alt" onPress={handleShare} type="secondary">
          {i18n.t('home_btn_share').toUpperCase()}
        </Button>
      </View>
    );
  };

  return (
    <View style={[theme.withPadding, style]} {...rest}>
      {renderBigButton()}
      {renderSmallButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.mini
  }
});
