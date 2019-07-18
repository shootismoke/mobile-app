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

import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { Cigarettes } from '../../components';
import { Footer } from './Footer';
import { Header } from './Header';
import { i18n } from '../../localization';
import { AqiHistory, getAqiHistory } from '../../managers';
import { Frequency, SelectFrequency } from './SelectFrequency';
import { SmokeVideo } from './SmokeVideo';
import { ApiContext, CurrentLocationContext } from '../../stores';
import swearWords from './swearWords';
import * as theme from '../../util/theme';

interface HomeProps extends NavigationInjectedProps {}

function getSwearWord (cigaretteCount: number) {
  if (cigaretteCount <= 1) return i18n.t('home_common_oh');

  // Return a random swear word
  return swearWords[Math.floor(Math.random() * swearWords.length)];
}

export function Home (props: HomeProps) {
  const { api } = useContext(ApiContext)!;
  const { isGps } = useContext(CurrentLocationContext)!;
  const [frequency, setFrenquency] = useState<Frequency>('daily');
  const [aqiHistory, setAqiHistory] = useState<AqiHistory>({
    pastMonth: O.none,
    pastWeek: O.none
  });
  const [cigaretteCount, setCigaretteCount] = useState(
    api!.shootISmoke.cigarettes
  );
  const [swearWord, setSwearWord] = useState(i18n.t('home_common_oh'));

  useEffect(() => {
    pipe(
      getAqiHistory(),
      TE.fold(
        err => {
          console.log(`<Home> - useEffect - ${err.message}`);

          return T.of(undefined);
        },
        history => {
          setAqiHistory(history);

          return T.of(undefined);
        }
      )
    )();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let cigCount = 0;
      if (frequency === 'monthly') {
        cigCount = O.getOrElse(() => 0)(aqiHistory.pastMonth);
      } else if (frequency === 'weekly') {
        cigCount = O.getOrElse(() => 0)(aqiHistory.pastWeek);
      } else {
        cigCount = api!.shootISmoke.cigarettes;
      }

      setCigaretteCount(cigCount);
      setSwearWord(getSwearWord(cigCount));
    }, 200);
  }, [frequency]);

  function renderPresentPast () {
    if (!isGps) {
      return i18n.t('home_common_you_d_smoke');
    }

    return i18n.t('home_common_you_smoke');
  }

  const renderText = () => {
    // Round to 1 decimal
    const cigarettes = Math.round(cigaretteCount * 10) / 10;

    const text = i18n.t('home_smoked_cigarette_title', {
      swearWord,
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
      <SmokeVideo cigarettes={cigaretteCount} />
      <Header
        onChangeLocationClick={() => props.navigation.navigate('Search')}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <View style={styles.content}>
          <Cigarettes cigarettes={cigaretteCount} style={theme.withPadding} />
          <View style={styles.main}>{renderText()}</View>
          {isGps ? (
            <SelectFrequency
              aqiHistory={aqiHistory}
              frequency={frequency}
              onChangeFrequency={freq => {
                setFrenquency(freq);
              }}
              style={styles.selectFrequency}
            />
          ) : (
            <Text style={styles.thereToday}>
              {i18n.t('home_smoked_there')}.
            </Text>
          )}
        </View>
        <Footer frequency={frequency} navigation={props.navigation} />
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
    justifyContent: 'center',
    marginTop: theme.spacing.normal
  },
  dots: {
    color: theme.primaryColor
  },
  main: {
    ...theme.withPadding
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  scrollView: { flex: 1 },
  selectFrequency: {
    marginTop: theme.spacing.tiny
  },
  shit: {
    ...theme.shitText,
    marginTop: theme.spacing.normal
  },
  thereToday: {
    ...theme.shitText,
    ...theme.withPadding
  }
});
