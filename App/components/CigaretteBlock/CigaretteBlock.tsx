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

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { i18n } from '../../localization';
import { Frequency } from '../../stores';
import * as theme from '../../util/theme';
import { Cigarettes } from '../Cigarettes';
import swearWords from './swearWords';

interface CigaretteBlockProps extends ViewProps {
  cigarettes: number;
  displayFrequency?: boolean;
  frequency: Frequency;
  isGps: boolean;
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

function getSwearWord(cigaretteCount: number): string {
  if (cigaretteCount <= 1) return i18n.t('home_common_oh');

  // Return a random swear word
  return swearWords[Math.floor(Math.random() * swearWords.length)];
}

export function CigaretteBlock(props: CigaretteBlockProps): React.ReactElement {
  const { cigarettes, frequency, style, displayFrequency, ...rest } = props;

  // Decide on a swear word. The effect says that the swear word only changes
  // when the cigarettes count changes.
  const [swearWord, setSwearWord] = useState(getSwearWord(cigarettes));
  useEffect(() => {
    setSwearWord(getSwearWord(cigarettes));
  }, [cigarettes]);

  const renderCigarettesText = (): React.ReactElement => {
    // Round to 1 decimal
    const cigarettesRounded = Math.round(cigarettes * 10) / 10;

    const text = i18n.t('home_smoked_cigarette_title', {
      swearWord,
      presentPast: i18n.t('home_common_you_smoke'),
      singularPlural:
        cigarettesRounded === 1
          ? i18n.t('home_common_cigarette').toLowerCase()
          : i18n.t('home_common_cigarettes').toLowerCase(),
      cigarettes: cigarettesRounded
    });

    const [firstPartText, secondPartText] = text.split('<');

    const frequencyText = displayFrequency ? (
      <Text>{i18n.t(`frequency_${frequency}`)}</Text>
    ) : null;

    return (
      <Text style={styles.shit}>
        {firstPartText}
        <Text style={styles.cigarettesCount}>
          {secondPartText.split('>')[0]}
        </Text>
        {secondPartText.split('>')[1]} {frequencyText}
      </Text>
    );
  };

  return (
    <View style={[theme.withPadding, style]} {...rest}>
      <Cigarettes cigarettes={cigarettes} />
      {renderCigarettesText()}
    </View>
  );
}
