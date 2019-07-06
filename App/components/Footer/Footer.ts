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

import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { About } from '../../Screens/About';
import * as theme from '../../utils/theme';

export class Footer extends PureComponent {
  static defaultProps = {
    text: 'Click to understand how we did the math.'
  };

  state = {
    isAboutVisible: false
  };

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  render () {
    const { style, text } = this.props;
    const { isAboutVisible } = this.state;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity onPress={this.handleAboutShow}>
          <Text style={styles.link}>{text}</Text>
        </TouchableOpacity>
        <About onRequestClose={this.handleAboutHide} visible={isAboutVisible} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.normal,
    marginTop: theme.spacing.normal
  },
  link: {
    ...theme.text,
    ...theme.link,
    fontSize: 13
  }
});
