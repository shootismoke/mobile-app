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

import { format } from 'date-fns';
import { uniq } from 'fp-ts/lib/Array';
import { contramap, eqString } from 'fp-ts/lib/Eq';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { BackButton, ListItem, ListSeparator } from '../../components';
import { Frequency } from '../Home/SelectFrequency';
import { i18n } from '../../localization';
import { AqiHistory, AqiHistoryDbItem } from '../../managers/AqiHistoryDb';
import * as theme from '../../util/theme';

interface Params {
  aqiHistory: O.Option<AqiHistory>;
  frequency: Frequency;
}

interface PastStationsProps extends NavigationInjectedProps<Params> {}

const UNKNOWN_STATION = i18n.t('').toUpperCase();

// Determine when two `AqiHistoryDbItem` items are equal in the list, so that we
// only show them once
const eqStation = contramap(
  (item: AqiHistoryDbItem) => item.station || UNKNOWN_STATION
)(eqString);

export function PastStations (props: PastStationsProps) {
  const { navigation } = props;
  const aqiHistory = navigation.getParam('aqiHistory');
  const frequency = navigation.getParam('frequency');

  if (frequency === 'daily') {
    navigation.pop();
    return;
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.pop()} style={theme.withPadding} />
      <View style={theme.withPadding}>
        <Text style={styles.date}>
          {pipe(
            aqiHistory,
            O.map(history => history[frequency]),
            O.fold(
              () => i18n.t('past_stations_loading').toUpperCase(),
              summary =>
                i18n
                  .t('past_stations_date_from_to', {
                    startDate: format(summary.firstResult, 'DD/MM/YYYY'),
                    endDate: format(summary.lastResult, 'DD/MM/YYYY')
                  })
                  .toUpperCase()
            )
          )}
        </Text>
        <Text style={styles.description}>
          {i18n
            .t(
              frequency === 'weekly'
                ? 'past_stations_monitored_weekly'
                : 'past_stations_monitored_monthly'
            )
            .toUpperCase()}
        </Text>
      </View>

      <FlatList
        data={pipe(
          aqiHistory,
          O.map(history => history[frequency].data),
          O.map(uniq(eqStation)),
          O.getOrElse<AqiHistoryDbItem[]>(() => [])
        )}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={({ station }) => station || UNKNOWN_STATION}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

function renderItem ({ item }: { item: AqiHistoryDbItem }) {
  return (
    <ListItem
      description={[item.city, item.country].join(', ')}
      icon="pin"
      title={item.station || UNKNOWN_STATION}
    />
  );
}

function renderSeparator () {
  return <ListSeparator />;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: theme.spacing.normal
  },
  date: {
    ...theme.title,
    color: theme.primaryColor,
    marginTop: theme.spacing.normal
  },
  description: {
    ...theme.title
  },
  list: {
    flex: 1
  }
});
