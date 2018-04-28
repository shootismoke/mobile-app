import React, { Component } from 'react';
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
    search: ''
  };

  handleChangeSearch = search => this.setState({ search });

  render() {
    const { onRequestClose, ...rest } = this.props;
    const { search } = this.state;

    return (
      <Modal animationType="fade" onRequestClose={onRequestClose} {...rest}>
        <View style={styles.container}>
          <BackButton onClick={onRequestClose} />
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
            data={[
              { description: 'deg', key: 'abc', title: 'abc' },
              { description: 'deg', key: 'etds', title: 'etds' },
              { description: 'deg', key: 'erw', title: 'erw' }
            ]}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }

  renderItem = ({ item: { description, title } }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={pinIcon} />
      <View style={styles.itemResult}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  renderSeparator = () => <View style={styles.separator} />;
}

const styles = StyleSheet.create({
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
