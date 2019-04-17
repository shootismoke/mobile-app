// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Video } from 'expo';

import smokeVideo from '../../../../assets/video/smoke_bg_fafafc.mp4';

@inject('stores')
@observer
export class SmokeVideo extends Component {
  getVideoStyle = () => {
    const {
      stores: { cigarettes }
    } = this.props;

    if (cigarettes <= 1) return { backgroundColor: '#FFFFFFCC' };
    if (cigarettes < 5) return { backgroundColor: '#FFFFFFAA' };
    if (cigarettes < 15) return { backgroundColor: '#FFFFFF22' };
    return { backgroundColor: '#FFFFFF00' };
  };

  render () {
    return (
      <View style={styles.container}>
        <View style={[styles.overlay, this.getVideoStyle()]} />
        <Video
          isLooping
          resizeMode='cover'
          shouldPlay
          source={smokeVideo}
          style={styles.video}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    right: 0,
    width: Dimensions.get('screen').width
  },
  overlay: {
    flex: 1
  },
  video: {
    bottom: 0,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    right: 0,
    width: Dimensions.get('screen').width,
    zIndex: -1
  }
});
