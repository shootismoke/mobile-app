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

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import retry from 'async-retry';

import { BackButton } from '../../components/BackButton';
import { Item } from './Item';
import { SearchHeader } from './SearchHeader';
import * as theme from '../../utils/theme';

// As per https://community.algolia.com/places/rest.html
const algoliaUrls = [
  'https://places-dsn.algolia.net',
  'https://places-1.algolianet.com',
  'https://places-2.algolianet.com',
  'https://places-3.algolianet.com'
];

@inject('stores')
@observer
export class Search extends Component {
  state = {
    hasErrors: false, // Error from algolia
    hits: null,
    loading: false,
    search: ''
  };

  typingTimeout = null; // Timeout to detect when user stops typing

  componentWillUnmount () {
    clearTimeout(this.typingTimeout);
  }

  // TODO This should be a cancelable Promise, to avoid the warning
  // "Can't call setState on an unmounted component"
  fetchResults = async search => {
    const {
      stores: {
        location: { gps }
      }
    } = this.props;

    try {
      this.setState({ loading: true });
      await retry(
        async (_, attempt) => {
          console.log(
            `<Search> - fetchResults - Attempt #${attempt}: ${
              algoliaUrls[attempt - 1]
            }/1/places/query`
          );
          const {
            data: { hits }
          } = await axios.post(
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
          );

          console.log('<Search> - fetchResults - Got', hits.length, 'results');
          this.setState({ hits });
        },
        {
          retries: 3
        }
      );
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ hasErrors: true, loading: false });
    }
  };

  handleChangeSearch = search => {
    this.setState({ search });
    if (!search) {
      return;
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => this.fetchResults(search), 500);
  };

  handleItemClick = item => {
    // Reset everything when we choose a new location.
    this.props.stores.location.setCurrent(item);
    this.props.stores.setError(undefined);
    this.props.stores.setApi(undefined);
  };

  render () {
    const { navigation } = this.props;
    const { hits, search } = this.state;

    return (
      <View style={styles.container}>
        <BackButton onClick={navigation.pop} style={styles.backButton} />
        <SearchHeader
          onChangeSearch={this.handleChangeSearch}
          search={search}
        />
        <FlatList
          data={hits}
          ItemSeparatorComponent={this.renderSeparator}
          keyboardShouldPersistTaps='always'
          keyExtractor={({ objectID }) => objectID}
          ListEmptyComponent={
            <Text style={styles.noResults}>{this.renderInfoText()}</Text>
          }
          renderItem={this.renderItem}
          style={styles.list}
        />
      </View>
    );
  }

  renderItem = ({ item }) => (
    <Item item={item} onClick={this.handleItemClick} />
  );

  renderSeparator = () => <View style={styles.separator} />;

  renderInfoText = () => {
    const { hasErrors, hits, loading, search } = this.state;

    if (!search) return '';
    if (loading) return 'Waiting for results...';
    if (hasErrors) return 'Error fetching locations. Please try again later.';
    if (hits && hits.length === 0) return 'No results.';
    return 'Waiting for results.';
  };
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
