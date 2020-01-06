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

import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { i18n } from '../../localization';
import { Frequency } from '../../Screens/Home/SelectFrequency';
import * as theme from '../../util/theme';
import { Cigarettes } from '../Cigarettes';
import swearWords from './swearWords';

interface CigaretteBlockProps extends ViewProps {
  cigarettesPerDay: number;
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

/**
 * Compute the number of cigarettes to show
 */
export function getCigaretteCount(
  frequency: Frequency,
  cigarettePerDay: number
): number {
  switch (frequency) {
    case 'daily': {
      return cigarettePerDay;
    }
    case 'weekly':
      return cigarettePerDay * 7;
    case 'monthly': {
      return cigarettePerDay * 30;
    }
  }
}

export function CigaretteBlock(props: CigaretteBlockProps): React.ReactElement {
  const {
    cigarettesPerDay,
    frequency,
    isGps,
    style,
    displayFrequency,
    ...rest
  } = props;

  const cigaretteCount = getCigaretteCount(frequency, cigarettesPerDay);

  const renderCigarettesText = (): React.ReactElement => {
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
      <Cigarettes cigarettes={cigaretteCount} />
      {renderCigarettesText()}
    </View>
  );
}
