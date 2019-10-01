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
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { Cigarettes } from '../../../components';
import { i18n } from '../../../localization';
import { Frequency } from '../SelectFrequency';
import { CurrentLocationContext } from '../../../stores';
import swearWords from './swearWords';
import * as theme from '../../../util/theme';

interface CigaretteBlockProps extends ViewProps {
  cigaretteCount: number;
  frequency: Frequency;
}

function getSwearWord (cigaretteCount: number) {
  if (cigaretteCount <= 1) return i18n.t('home_common_oh');

  // Return a random swear word
  return swearWords[Math.floor(Math.random() * swearWords.length)];
}

export function CigaretteBlock (props: CigaretteBlockProps) {
  const { isGps } = useContext(CurrentLocationContext)!;
  const { cigaretteCount, frequency, style, ...rest } = props;

  const renderCigarettesText = () => {
    // Round to 1 decimal
    const cigarettes = Math.round(cigaretteCount * 10) / 10;

    const text = i18n.t('home_smoked_cigarette_title', {
      swearWord: getSwearWord(cigaretteCount),
      presentPast:
        isGps && frequency === 'daily'
          ? i18n.t('home_common_you_smoke')
          : i18n.t('home_common_you_d_smoke'),
      singularPlural:
        cigarettes === 1
          ? i18n.t('home_common_cigarette').toLowerCase()
          : i18n.t('home_common_cigarettes').toLowerCase(),
      cigarettes
    });

    const [firstPartText, secondPartText] = text.split('<');

    return (
      <Text style={styles.shit}>
        {firstPartText}
        <Text style={styles.cigarettesCount}>
          {secondPartText.split('>')[0]}
        </Text>
        {secondPartText.split('>')[1]}
      </Text>
    );
  };

  return (
    <View style={[theme.withPadding, style]} {...rest}>
      <Cigarettes cigarettes={cigaretteCount} />
      {renderCigarettesText()}
    </View>
  );
}

const styles = StyleSheet.create({
  cigarettesCount: {
    color: theme.primaryColor
  },
  shit: {
    ...theme.shitText,
    marginTop: theme.spacing.normal
  }
});
