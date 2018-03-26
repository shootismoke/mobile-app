import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Cigarette from './Cigarette';
import pm25ToCigarette from '../Home/utils/pm25ToCigarettes';

export default class Cigarettes extends Component {
  getSize = cigarettes => {
    if (cigarettes <= 1) return 'big';
    if (cigarettes <= 5) return 'big';
    if (cigarettes <= 15) return 'medium';
    return 'small';
  };

  render() {
    const { api, style } = this.props;
    const cigarettes = api ? Math.min(pm25ToCigarette(api.iaqi.pm25.v), 63) : 1;
    const count = Math.floor(cigarettes);
    const decimal = cigarettes - count;

    const diagonal = cigarettes <= 1;
    const vertical = cigarettes >= 5;

    return (
      <View style={style}>
        <View
          style={[
            styles.container,
            diagonal ? { justifyContent: 'center' } : null
          ]}
        >
          {count > 1
            ? Array.from(Array(count)).map((_, i) => (
                <View key={i}>
                  <Cigarette
                    size={this.getSize(cigarettes)}
                    vertical={vertical}
                  />
                </View>
              ))
            : null}
          {cigarettes === 1 || decimal > 0 ? (
            <Cigarette
              diagonal={diagonal}
              length={decimal || 1}
              size={this.getSize(cigarettes)}
              vertical={vertical}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
