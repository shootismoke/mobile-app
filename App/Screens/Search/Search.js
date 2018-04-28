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

import BackButton from '../../BackButton';
import pinIcon from '../../../assets/images/location.png';
import searchIcon from '../../../assets/images/search.png';
import * as theme from '../../utils/theme';

export default class Search extends Component {
  state = {
    hits: [],
    search: ''
  };

  handleChangeSearch = async search => {
    const { gps } = this.props;
    this.setState({ search });
    try {
      const {
        data: { hits }
      } = await axios.post(
        'https://places-dsn.algolia.net/1/places/query',
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
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { onRequestClose, ...rest } = this.props;
    const { hits, search } = this.state;

    return (
      <Modal animationType="slide" onRequestClose={onRequestClose} {...rest}>
        <View style={styles.container}>
          <BackButton onClick={onRequestClose} style={styles.backButton} />
          <View style={styles.header}>
            <TextInput
              autoFocus
              onChangeText={this.handleChangeSearch}
              style={styles.input}
              value={search}
            />
            <Image source={searchIcon} />
          </View>
          <FlatList
            data={hits}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={({ objectID }) => objectID}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }

  renderItem = ({ item: { city, country, county, locale_names } }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={pinIcon} />
      <View style={styles.itemResult}>
        <Text style={styles.itemTitle}>{locale_names[0]}</Text>
        <Text style={styles.itemDescription}>
          {[city, ...(county || []), country].filter(_ => _).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
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
  itemContainer: {
    ...theme.withPadding,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 17
  },
  itemDescription: {
    ...theme.text,
    marginTop: 4
  },
  itemResult: {
    marginLeft: 17
  },
  itemTitle: {
    ...theme.title
  },
  separator: {
    backgroundColor: '#D2D2D2',
    height: 1,
    marginLeft: 17 + 22 + 17 // Margin + imgWidth + margin
  }
});
