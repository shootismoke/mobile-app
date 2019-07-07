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
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { Cigarettes } from '../../components/Cigarettes';
import { Header } from './Header';
import { i18n } from '../../localization';
import { SmallButton } from './SmallButton';
import { SmokeVideo } from './SmokeVideo';
import { ApiContext, CurrentLocationContext } from '../../stores';
import swearWords from './swearWords';
import { isStationTooFar } from '../../utils/station';
import * as theme from '../../utils/theme';

interface HomeProps extends NavigationInjectedProps {}

export function Home(props: HomeProps) {
  const api = useContext(ApiContext)!;
  const { currentLocation } = useContext(CurrentLocationContext);

  const isTooFar = isStationTooFar(currentLocation!, api);

  function goToAbout() {
    props.navigation.navigate('About');
  }

  function goToDetails() {
    props.navigation.navigate('Details');
  }

  function handleShare() {
    return Share.share({
      title: i18n.t('home_share_title'),
      message: i18n.t('home_share_message', {
        cigarettes: api!.shootISmoke.cigarettes
      })
    });
  }

  const renderBigButton = () => {
    if (isTooFar) {
      return (
        <TouchableOpacity onPress={goToAbout}>
          <View style={theme.bigButton}>
            <Text style={theme.bigButtonText}>
              {i18n.t('home_btn_why_is_station_so_far').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={goToDetails}>
        <View style={theme.bigButton}>
          <Text style={theme.bigButtonText}>
            {i18n.t('home_btn_see_detailed_info').toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.smallButtons}>
        {isTooFar ? (
          <SmallButton
            icon="plus-circle"
            text={i18n.t('home_btn_more_details').toUpperCase()}
            onPress={goToDetails}
          />
        ) : (
          <SmallButton
            icon="question-circle"
            text={i18n.t('home_btn_faq_about').toUpperCase()}
            onPress={goToAbout}
          />
        )}
        <SmallButton
          icon="share-alt"
          text={i18n.t('home_btn_share').toUpperCase()}
          onPress={handleShare}
        />
      </View>
    );
  };

  function renderPresentPast() {
    const time = new Date().getHours();

    if (time < 15) return i18n.t('home_common_you_ll_smoke');
    return i18n.t('home_common_you_smoked');
  }

  function renderShit() {
    if (api!.shootISmoke.cigarettes <= 1) return i18n.t('home_common_oh');

    // Return a random swear word
    return swearWords[Math.floor(Math.random() * swearWords.length)];
  }

  const renderText = () => {
    // Round to 1 decimal
    const cigarettes = Math.round(api!.shootISmoke.cigarettes * 10) / 10;

    const text = i18n.t('home_smoked_cigarette_title', {
      swearWord: renderShit(),
      presentPast: renderPresentPast(),
      singularPlural:
        cigarettes === 1
          ? i18n.t('home_common_cigarette').toLowerCase()
          : i18n.t('home_common_cigarettes').toLowerCase(),
      cigarettes
    });

    const firstPartText = text.split('<')[0];
    const secondPartText = text.split('<')[1];

    return (
      <Text adjustsFontSizeToFit style={styles.shit}>
        {firstPartText}
        <Text style={styles.cigarettesCount}>
          {secondPartText.split('>')[0]}
        </Text>
        {secondPartText.split('>')[1]}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <SmokeVideo />
      <Header
        onChangeLocationClick={() => props.navigation.navigate('Search')}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <View style={styles.content}>
          <Cigarettes cigarettes={api.shootISmoke.cigarettes} />
          <View style={styles.main}>{renderText()}</View>
        </View>
        <View style={styles.cta}>
          {isTooFar && (
            <Text style={styles.isStationTooFar}>
              {i18n.t('home_station_too_far_message')}
            </Text>
          )}
          {renderBigButton()}
          {renderFooter()}
        </View>
      </ScrollView>
    </View>
  );
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
    justifyContent: 'center',
    marginTop: theme.spacing.normal
  },
  cta: {
    ...theme.withPadding,
    marginTop: theme.spacing.normal
  },
  dots: {
    color: theme.primaryColor
  },
  isStationTooFar: {
    ...theme.text,
    marginBottom: theme.spacing.normal
  },
  main: {
    marginBottom: theme.spacing.normal
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  scrollView: { flex: 1 },
  shit: {
    ...theme.shitText,
    marginTop: theme.spacing.normal
  },
  smallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2 * theme.spacing.normal,
    marginTop: theme.spacing.normal
  }
});
