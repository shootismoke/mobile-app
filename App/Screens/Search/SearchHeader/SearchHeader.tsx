// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

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

import React from 'react';
import { Image, StyleSheet, TextInput } from 'react-native';

import searchIcon from '../../../../assets/images/search.png';
import { Banner } from '../../../components';
import { i18n } from '../../../localization';
import * as theme from '../../../util/theme';

interface SearchHeaderProps {
  onChangeSearch?: (text: string) => void;
  search: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor
  },
  content: {
    ...theme.withPadding,
    alignItems: 'center',
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

export function SearchHeader(props: SearchHeaderProps): React.ReactElement {
  const { onChangeSearch, search } = props;

  return (
    <Banner elevated shadowPosition="bottom">
      <TextInput
        autoFocus
        onChangeText={onChangeSearch}
        placeholder={i18n.t('search_header_input_placeholder')}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        style={styles.input}
        underlineColorAndroid="transparent"
        value={search}
      />
      <Image source={searchIcon} />
    </Banner>
  );
}
