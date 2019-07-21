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
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import Sentry from 'sentry-expo';

import { BackButton, ListSeparator } from '../../components';
import { AlgoliaHit, fetchAlgolia } from './fetchAlgolia';
import { AlgoliaItem } from './AlgoliaItem';
import { GpsItem } from './GpsItem';
import { SearchHeader } from './SearchHeader';
import {
  CurrentLocationContext,
  ErrorContext,
  GpsLocationContext
} from '../../stores';
import { Location } from '../../stores/fetchGpsPosition';
import * as theme from '../../util/theme';

// Timeout to detect when user stops typing
let typingTimeout: NodeJS.Timeout | null = null;

interface SearchProps extends NavigationInjectedProps {}

export function Search (props: SearchProps) {
  const { isGps, setCurrentLocation } = useContext(CurrentLocationContext);
  const { setError } = useContext(ErrorContext);
  const gps = useContext(GpsLocationContext);

  const [algoliaError, setAlgoliaError] = useState<Error | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [hits, setHits] = useState<AlgoliaHit[]>([]);

  function handleChangeSearch (s: string) {
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
      pipe(
        fetchAlgolia(s, gps),
        TE.fold(
          err => {
            console.log('<Search> - handleChangeSearch -', err.message);
            setLoading(false);
            setAlgoliaError(err);

            Sentry.captureException(err);
            return T.of(undefined as void);
          },
          hits => {
            setLoading(false);
            setAlgoliaError(undefined);
            setHits(hits);

            return T.of(undefined as void);
          }
        )
      )();
    }, 500);
  }

  function handleItemClick (item: Location) {
    // Reset everything when we choose a new location.
    setCurrentLocation(item);
    setError(undefined);
  }

  function renderItem ({ item }: { item: AlgoliaHit }) {
    return <AlgoliaItem item={item} onClick={handleItemClick} />;
  }

  return (
    <View style={styles.container}>
      <BackButton
        onPress={() => props.navigation.pop()}
        style={styles.backButton}
      />
      <SearchHeader onChangeSearch={handleChangeSearch} search={search} />
      <FlatList
        data={hits}
        ItemSeparatorComponent={renderSeparator}
        keyboardShouldPersistTaps="always"
        keyExtractor={({ objectID }) => objectID}
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

function renderEmptyList (
  algoliaError: Error | undefined,
  hits: AlgoliaHit[],
  loading: boolean,
  search: string,
  isGps: boolean
) {
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

function renderSeparator () {
  return <ListSeparator />;
}

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
