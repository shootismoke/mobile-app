import React, { Component } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

import searchIcon from '../../../assets/images/search.png';
import * as theme from '../../utils/theme';

export default class Search extends Component {
  state = {
    search: ''
  };

  handleChangeSearch = search => this.setState({ search });

  render() {
    const { ...rest } = this.props;
    const { search } = this.state;

    return (
      <Modal animationType="fade" {...rest}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextInput
              autoFocus
              onChangeText={this.handleChangeSearch}
              style={styles.input}
              value={search}
            />
            <Image source={searchIcon} />
          </View>
        </View>
      </Modal>
    );
  }
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
  }
});
