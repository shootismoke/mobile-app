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

import React, { useEffect, createRef } from 'react';
import { Share, StyleSheet, View, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { NavigationInjectedProps } from 'react-navigation';
import * as Sharing from 'expo-sharing';

import { ShareImage } from './ShareImage';
import { i18n } from '../../localization';
import { Button } from '../../components';
import * as theme from '../../util/theme';

interface ShareScreenProps extends NavigationInjectedProps {}

export function ShareScreen (props: ShareScreenProps) {
  const refViewShot = createRef<View>();

  useEffect(() => {
    setTimeout(async () => {
      try {
        const uri = await captureRef(refViewShot, {
          format: 'png',
          quality: 1
        });

        if (Platform.OS === 'ios') {
          await Share.share({
            url: uri
          });
        } else {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png'
          });
        }
      } catch (error) {}

      handleDismiss();
    }, 750);
  });

  const handleDismiss = () => {
    props.navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={refViewShot} collapsable={false}>
          <ShareImage />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleDismiss} style={styles.button}>
            {i18n.t('close_button').toUpperCase()}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.fullScreen,
    ...theme.withPadding,
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },

  buttonContainer: {
    paddingVertical: theme.spacing.normal
  },

  button: {
    paddingHorizontal: theme.spacing.mini
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.8 }]
  }
});
