import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import searchIcon from '../../../../assets/images/search.png';
import * as theme from '../../../utils/theme';

export default class SearchHeader extends Component {
  handleClick = () => {
    const {
      item: { city, country, county, _geoloc, locale_names },
      onClick
    } = this.props;
    onClick({
      latitude: _geoloc.lat,
      longitude: _geoloc.lng,
      name: [
        locale_names[0],
        city,
        county && county.length ? county[0] : null,
        country
      ]
        .filter(_ => _)
        .join(', ')
    });
  };

  render() {
    const {
      asTouchable,
      elevated,
      onChangeSearch,
      onClick,
      search,
      style,
      ...rest
    } = this.props;
    const Wrapper = asTouchable ? TouchableWithoutFeedback : View;

    return (
      <Wrapper onPress={asTouchable ? onClick : undefined}>
        <View
          style={[
            styles.container,
            elevated === true ? theme.elevatedLevel1 : null,
            elevated === 'very' ? theme.elevatedLevel2 : null,
            style
          ]}
        >
          <TextInput
            onChangeText={onChangeSearch}
            placeholder="Search for a city or address"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            style={styles.input}
            value={search}
            {...rest}
          />
          <Image source={searchIcon} />
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 13
  }
});
