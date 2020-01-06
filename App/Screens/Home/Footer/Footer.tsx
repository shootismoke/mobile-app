// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

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
import { StyleSheet, View, ViewProps } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { Button } from '../../../components';
import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { track } from '../../../util/amplitude';
import { isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';
import { aboutSections } from '../../About';

interface FooterProps extends NavigationInjectedProps, ViewProps {}

const styles = StyleSheet.create({
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.mini
  }
});

export function Footer(props: FooterProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { navigation, style, ...rest } = props;

  if (!currentLocation) {
    throw new Error(
      'Home/Footer/Footer.tsx only gets calculate the `distanceToStation` when `currentLocation` is defined.'
    );
  } else if (!api) {
    throw new Error(
      'Home/Footer/Footer.tsx only gets calculate the `distanceToStation` when `api` is defined.'
    );
  }

  const isTooFar = isStationTooFar(currentLocation, api);

  function goToAbout(): void {
    track('HOME_SCREEN_ABOUT_CLICK');
    navigation.navigate('About');
  }

  function goToAboutWhySoFar(): void {
    track('HOME_SCREEN_ABOUT_WHY_SO_FAR_CLICK');
    navigation.navigate('About', {
      scrollInto: aboutSections.aboutWhyIsTheStationSoFarTitle
    });
  }

  function goToDetails(): void {
    track('HOME_SCREEN_DETAILS_CLICK');
    navigation.navigate('Details');
  }

  function handleShare(): void {
    track('HOME_SCREEN_SHARE_CLICK');

    props.navigation.navigate('ShareModal');
  }

  function renderBigButton(): React.ReactElement {
    return isTooFar ? (
      <Button onPress={goToAboutWhySoFar}>
        {i18n.t('home_btn_why_is_station_so_far').toUpperCase()}
      </Button>
    ) : (
      <Button onPress={goToDetails}>
        {i18n.t('home_btn_see_detailed_info').toUpperCase()}
      </Button>
    );
  }

  function renderSmallButtons(): React.ReactElement {
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
  }

  return (
    <View style={[theme.withPadding, style]} {...rest}>
      {renderBigButton()}
      {renderSmallButtons()}
    </View>
  );
}
