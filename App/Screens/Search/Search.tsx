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

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { pipe } from 'fp-ts/lib/pipeable';
import * as consoleFp from 'fp-ts/lib/Console';
import * as either from 'fp-ts/lib/Either';
import * as io from 'fp-ts/lib/IO';
import * as task from 'fp-ts/lib/Task';
import * as taskE from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { BackButton } from '../../components/BackButton';
import { Item } from './Item';
import { SearchHeader } from './SearchHeader';
import {
  CurrentLocationContext,
  ErrorContext,
  GpsLocationContext,
  LatLng,
  Location
} from '../../stores';
import { sideEffect } from '../../utils/fp';
import * as theme from '../../utils/theme';

// As per https://community.algolia.com/places/rest.html
const algoliaUrls = [
  'https://places-dsn.algolia.net',
  'https://places-1.algolianet.com',
  'https://places-2.algolianet.com',
  'https://places-3.algolianet.com'
];

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/132720a17e15cdfcffade54dd4a23a21c1e16831/types/algoliasearch/index.d.ts#L2072
const AlgoliaHitT = t.exact(
  t.intersection([
    t.type({
      _geoloc: t.type({
        lat: t.number,
        lng: t.number
      }),
      country: t.string,
      locale_names: t.array(t.string),
      objectID: t.string
    }),
    t.partial({
      city: t.array(t.string),
      county: t.array(t.string)
    })
  ])
);
export type AlgoliaHit = t.TypeOf<typeof AlgoliaHitT>;

const AxiosResponseT = t.type({
  data: t.type({
    hits: t.array(AlgoliaHitT)
  })
});

function fetchAlgolia(search: string, gps?: LatLng, attempt: number = 1) {
  return pipe(
    taskE.rightIO(
      consoleFp.log(
        `<Search> - handleChangeSearch - Attempt #${attempt}: ${
          algoliaUrls[attempt - 1]
        }/1/places/query`
      )
    ),
    taskE.chain(() =>
      taskE.tryCatch(
        () =>
          axios.post(
            `${algoliaUrls[attempt - 1]}/1/places/query`,
            {
              aroundLatLng: gps
                ? `${gps.latitude},${gps.longitude}`
                : undefined,
              hitsPerPage: 10,
              language: 'en',
              query: search
            },
            {
              headers:
                Constants.manifest.extra.algoliaApplicationId &&
                Constants.manifest.extra.algoliaApiKey
                  ? {
                      'X-Algolia-Application-Id':
                        Constants.manifest.extra.algoliaApplicationId,
                      'X-Algolia-API-Key':
                        Constants.manifest.extra.algoliaApiKey
                    }
                  : undefined,

              timeout: 3000
            }
          ),
        reason => new Error(String(reason))
      )
    ),
    taskE.chain(response =>
      task.of(
        pipe(
          AxiosResponseT.decode(response),
          either.mapLeft(failure),
          either.mapLeft(errs => errs[0]), // Only show 1st error
          either.mapLeft(Error)
        )
      )
    ),
    taskE.map(response => response.data.hits),
    taskE.chain((hits: AlgoliaHit[]) =>
      taskE.rightIO(
        sideEffect(
          consoleFp.log(
            `<Search> - handleChangeSearch - Got ${hits.length} results`
          ),
          hits
        )
      )
    )
  );
}

// Timeout to detect when user stops typing
let typingTimeout: NodeJS.Timeout | null = null;

interface SearchProps extends NavigationInjectedProps {}

export function Search(props: SearchProps) {
  const { setLatLng } = useContext(CurrentLocationContext);
  const { setError } = useContext(ErrorContext);
  const gps = useContext(GpsLocationContext);

  const [algoliaError, setAlgoliaError] = useState<Error | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [hits, setHits] = useState<AlgoliaHit[]>([]);

  function handleChangeSearch(s: string) {
    setSearch(s);
    if (!s) {
      return;
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(() => {
      setHits([]);
      setLoading(true);

      taskE.fold<Error, AlgoliaHit[], unknown>(
        err => {
          console.log('<Search> - handleChangeSearch -', err.message);
          setLoading(false);
          setAlgoliaError(err);

          // TODO Log on Sentry
          return task.of(undefined as void);
        },
        hits => {
          setLoading(false);
          setAlgoliaError(undefined);
          setHits(hits);

          return task.of(undefined as void);
        }
      )(fetchAlgolia(s, gps))();
    }, 500);
  }

  function handleItemClick(item: Location) {
    // Reset everything when we choose a new location.
    setLatLng(item);
    setError(undefined);
    // TODO
    // this.props.stores.setApi(undefined);
  }

  function renderItem({ item }: { item: AlgoliaHit }) {
    return <Item item={item} onClick={handleItemClick} />;
  }

  return (
    <View style={styles.container}>
      <BackButton
        onClick={() => props.navigation.pop()}
        style={styles.backButton}
      />
      <SearchHeader onChangeSearch={handleChangeSearch} search={search} />
      <FlatList
        data={hits}
        ItemSeparatorComponent={renderSeparator}
        keyboardShouldPersistTaps="always"
        keyExtractor={({ objectID }) => objectID}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            {renderInfoText(algoliaError, hits, loading, search)}
          </Text>
        }
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

function renderInfoText(
  algoliaError: Error | undefined,
  hits: AlgoliaHit[],
  loading: boolean,
  search: string
) {
  if (!search) return '';
  if (loading) return 'Waiting for results...';
  if (algoliaError) return 'Error fetching locations. Please try again later.';
  if (hits && hits.length === 0) return 'No results.';
  return 'Waiting for results.';
}

function renderSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  backButton: {
    ...theme.withPadding,
    marginVertical: 18
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
  },
  separator: {
    backgroundColor: '#D2D2D2',
    height: 1,
    marginLeft: 17 + 22 + 17 // Margin + imgWidth + margin
  }
});
