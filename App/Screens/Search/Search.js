import React, { Component } from 'react';
import axios from 'axios';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import retry from 'async-retry';

import BackButton from '../../BackButton';
import Item from './Item';
import searchIcon from '../../../assets/images/search.png';
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
          <View style={styles.header}>
            <TextInput
              autoFocus
              onChangeText={this.handleChangeSearch}
              placeholder="Search for a city or address"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              style={styles.input}
              value={search}
            />
            <Image source={searchIcon} />
          </View>
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
  header: {
    ...theme.withPadding,
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    flexDirection: 'row',
    height: 48
  },
  input: {
    ...theme.text,
    color: 'white',
    flexGrow: 1,
    fontSize: 16
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
