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

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { BackButton, ListSeparator } from '../../components';
import { CurrentLocationContext, GpsLocationContext } from '../../stores';
import { Location } from '../../stores/util/fetchGpsPosition';
import { track, trackScreen } from '../../util/amplitude';
import { logFpError } from '../../util/fp';
import * as theme from '../../util/theme';
import { AlgoliaItem } from './AlgoliaItem';
import { AlgoliaHit, fetchAlgolia } from './fetchAlgolia';
import { GpsItem } from './GpsItem';
import { SearchHeader } from './SearchHeader';

// Timeout to detect when user stops typing
let typingTimeout: NodeJS.Timeout | null = null;

type SearchProps = NavigationInjectedProps;

const styles = StyleSheet.create({
  backButton: {
    ...theme.withPadding,
    marginVertical: theme.spacing.normal
  },
  container: {
    flexGrow: 1
  },
  list: {
    flex: 1
  },
  noResults: {
    ...theme.text,
    ...theme.withPadding,
    marginTop: theme.spacing.normal
  }
});

function renderSeparator(): React.ReactElement {
  return <ListSeparator />;
}

export function Search(props: SearchProps): React.ReactElement {
  const { isGps, setCurrentLocation } = useContext(CurrentLocationContext);
  const gps = useContext(GpsLocationContext);

  const [algoliaError, setAlgoliaError] = useState<Error | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [hits, setHits] = useState<AlgoliaHit[]>([]);

  trackScreen('SEARCH');

  function handleChangeSearch(s: string): void {
    setSearch(s);
    setAlgoliaError(undefined);
    setHits([]);

    if (!s) {
      return;
    }

    setLoading(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(() => {
      track('SEARCH_SCREEN_SEARCH', { search: s });

      pipe(
        fetchAlgolia(s, gps),
        TE.fold(
          err => {
            console.log('<Search> - handleChangeSearch -', err.message);
            setLoading(false);
            setAlgoliaError(err);

            return T.of(void undefined);
          },
          hits => {
            setLoading(false);
            setAlgoliaError(undefined);
            setHits(hits);

            return T.of(void undefined);
          }
        )
      )().catch(logFpError('Search'));
    }, 500);
  }

  function handleItemClick(item: Location): void {
    setCurrentLocation(item);
  }

  function renderItem({ item }: { item: AlgoliaHit }): React.ReactElement {
    return <AlgoliaItem item={item} onClick={handleItemClick} />;
  }

  function renderEmptyList(
    algoliaError: Error | undefined,
    hits: AlgoliaHit[],
    loading: boolean,
    search: string,
    isGps: boolean
  ): React.ReactElement | null {
    if (isGps && !search) {
      return null;
    }
    if (!search) return <GpsItem />;
    if (loading) {
      return <Text style={styles.noResults}>Waiting for results...</Text>;
    }
    if (algoliaError) {
      return (
        <Text style={styles.noResults}>
          Error fetching locations. Please try again later.
        </Text>
      );
    }
    if (hits && hits.length === 0) {
      return <Text style={styles.noResults}>No results.</Text>;
    }
    return <Text style={styles.noResults}>Waiting for results.</Text>;
  }

  return (
    <View style={styles.container}>
      <BackButton
        onPress={(): void => {
          props.navigation.goBack();
        }}
        style={styles.backButton}
      />
      <SearchHeader onChangeSearch={handleChangeSearch} search={search} />
      <FlatList
        data={hits}
        ItemSeparatorComponent={renderSeparator}
        keyboardShouldPersistTaps="always"
        keyExtractor={({ objectID }): string => objectID}
        ListEmptyComponent={renderEmptyList(
          algoliaError,
          hits,
          loading,
          search,
          isGps
        )}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}
