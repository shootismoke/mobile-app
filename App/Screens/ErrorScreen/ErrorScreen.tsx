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

import Constants from 'expo-constants';
import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { NavigationInjectedProps } from 'react-navigation';
import * as Sentry from 'sentry-expo';

import errorPicture from '../../../assets/images/error.png';
import { Button } from '../../components';
import { i18n } from '../../localization';
import { ErrorContext } from '../../stores';
import { track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';

type ErrorScreenProps = NavigationInjectedProps;

const styles = StyleSheet.create({
  chooseOther: {
    marginVertical: theme.spacing.normal
  },
  container: {
    ...theme.fullScreen,
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column'
  },
  errorMessage: {
    ...theme.text,
    fontSize: scale(10),
    marginTop: theme.spacing.small
  },
  errorText: {
    ...theme.shitText,
    marginTop: theme.spacing.big
  },
  sorry: {
    color: theme.primaryColor
  }
});

// We don't send the following errors to Sentry
const UNTRACKED_ERRORS = [
  'Permission to access location was denied',
  'Location provider is unavailable. Make sure that location services are enabled.',
  'Location request timed out.',
  'Location request failed due to unsatisfied device settings.'
];

export function ErrorScreen(props: ErrorScreenProps): React.ReactElement {
  const { error } = useContext(ErrorContext);

  trackScreen('ERROR');

  useEffect(() => {
    if (
      Constants.manifest.releaseChannel === 'production' &&
      error &&
      !UNTRACKED_ERRORS.includes(error.message)
    ) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Image source={errorPicture} />
      <View>
        <Text style={styles.errorText}>
          <Text style={styles.sorry}>
            {i18n.t('error_screen_common_sorry')}
          </Text>
          {i18n.t('error_screen_error_cannot_load_cigarettes')}
        </Text>
      </View>
      <Button
        onPress={(): void => {
          track('ERROR_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
        style={styles.chooseOther}
        type="primary"
      >
        {i18n.t('error_screen_choose_other_location').toUpperCase()}
      </Button>
      <Text style={theme.text}>{i18n.t('error_screen_error_description')}</Text>
      <Text style={styles.errorMessage}>
        {i18n.t('error_screen_error_message', {
          errorText: error && error.message
        })}
      </Text>
    </View>
  );
}
