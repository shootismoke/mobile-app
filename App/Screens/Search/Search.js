import React, { Component } from 'react';
import axios from 'axios';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import retry from 'async-retry';

import BackButton from '../../BackButton';
import SearchHeader from './SearchHeader';
import Item from './Item';
import * as theme from '../../utils/theme';

// As per https://community.algolia.com/places/rest.html
const algoliaUrls = [
  'https://places-dsn.algolia.net',
  'https://places-1.algolianet.com',
  'https://places-2.algolianet.com',
  'https://places-3.algolianet.com'
];

export default class Search extends Component {
  state = {
    hasErrors: false, // Error from algolia
    hits: [],
    search: ''
  };

  handleChangeSearch = async search => {
    this.setState({ search });
    if (!search) {
      return;
    }

    const { gps } = this.props;
    try {
      await retry(
        async (_, attempt) => {
          const {
            data: { hits }
          } = await axios.post(
            `${algoliaUrls[attempt + 1]}/1/places/query`,
            {
              aroundLatLng: `${gps.latitude},${gps.longitude}`,
              hitsPerPage: 10,
              language: 'en',
              query: search
            },
            {
              headers: {
                // 'X-Algolia-Application-Id': '',
                // 'X-Algolia-API-Key': ''
              }
            }
          );
          this.setState({ hits });
        },
        {
          retries: 4
        }
      );
    } catch (error) {
      this.setState({ hasErrors: true });
    }
  };

  render() {
    const { onRequestClose, ...rest } = this.props;
    const { hasErrors, hits, search } = this.state;

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
            keyExtractor={({ objectID }) => objectID}
            ListEmptyComponent={
              <Text style={styles.noResults}>
                {hasErrors
                  ? 'Error fetching locations. Please try again later.'
                  : 'Waiting for results.'}
              </Text>
            }
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }

  renderItem = ({ item }) => (
    <Item item={item} onClick={this.props.onChangeLocation} />
  );

  renderSeparator = () => <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  backButton: {
    ...theme.withPadding,
    marginVertical: 18
  },
  container: {
    ...theme.fullScreen,
    ...theme.modal
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
