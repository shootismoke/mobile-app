// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import retry from 'async-retry';

import { BackButton } from '../../components/BackButton';
import { SearchHeader } from './SearchHeader';
import { Item } from './Item';
import * as theme from '../../utils/theme';

// As per https://community.algolia.com/places/rest.html
const algoliaUrls = [
  'https://places-dsn.algolia.net',
  'https://places-1.algolianet.com',
  'https://places-2.algolianet.com',
  'https://places-3.algolianet.com'
];

export class Search extends Component {
  state = {
    hasErrors: false, // Error from algolia
    hits: null,
    loading: false,
    search: ''
  };

  typingTimeout = null; // Timeout to detect when user stops typing

  componentWillUnmount() {
    clearTimeout(this.typingTimeout);
  }

  fetchResults = async search => {
    const { gps } = this.props;
    try {
      this.setState({ loading: true });
      await retry(
        async (_, attempt) => {
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
    this.setState({ search: '' });
    this.props.onLocationChanged(item);
  };

  render() {
    const { onRequestClose, ...rest } = this.props;
    const { hits, search } = this.state;

    return (
      <Modal animationType="slide" onRequestClose={onRequestClose} {...rest}>
        <View style={styles.container}>
          <BackButton onClick={onRequestClose} style={styles.backButton} />
          <SearchHeader
            autoFocus
            elevated
            onChangeSearch={this.handleChangeSearch}
            search={search}
          />
          <FlatList
            data={hits}
            ItemSeparatorComponent={this.renderSeparator}
            keyboardShouldPersistTaps="always"
            keyExtractor={({ objectID }) => objectID}
            ListEmptyComponent={
              <Text style={styles.noResults}>{this.renderInfoText()}</Text>
            }
            renderItem={this.renderItem}
            style={styles.list}
          />
        </View>
      </Modal>
    );
  }

  renderItem = ({ item }) => (
    <Item item={item} onClick={this.handleItemClick} />
  );

  renderSeparator = () => <View style={styles.separator} />;

  renderInfoText = () => {
    const { hasErrors, hits } = this.state;

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
    ...theme.fullScreen,
    ...theme.modal,
    backgroundColor: 'white'
  },
  list: {
    flex: 1
  },
  noResults: {
    ...theme.text,
    ...theme.withPadding,
    marginTop: 22
  },
  separator: {
    backgroundColor: '#D2D2D2',
    height: 1,
    marginLeft: 17 + 22 + 17 // Margin + imgWidth + margin
  }
});
