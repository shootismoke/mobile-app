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

import React, { createRef, useContext } from 'react';
import { Platform, Share, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Button } from '../../../../components';
import { i18n } from '../../../../localization';
import { ApiContext } from '../../../../stores';
import { ShareImage } from './ShareImage';

const styles = StyleSheet.create({
  viewShot: {
    left: -9999,
    position: 'absolute'
  }
});

export function ShareButton(): React.ReactElement {
  const { api } = useContext(ApiContext);
  const refViewShot = createRef<View>();

  async function handleShare(): Promise<void> {
    try {
      const imageUrl = await captureRef(refViewShot, {
        format: 'png',
        quality: 1
      });
      const message = i18n.t('home_share_message', {
        cigarettes: api ? api.shootismoke.dailyCigarettes.toFixed(2) : 0
      });
      const title = i18n.t('home_share_title');

      if (Platform.OS === 'ios') {
        await Share.share({ url: imageUrl, title, message });
      } else {
        Share.share({ title, message });
      }
    } catch (error) {
      console.log(`<ShareButton> - ${error.message}`);
    }
  }

  return (
    <View>
      <View ref={refViewShot} style={styles.viewShot}>
        <ShareImage />
      </View>
      <Button icon="share-alt" onPress={handleShare} type="secondary">
        {i18n.t('home_btn_share').toUpperCase()}
      </Button>
    </View>
  );
}
