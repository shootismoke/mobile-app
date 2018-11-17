// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Video } from 'expo';

import smokeVideo from '../../../../assets/video/smoke.mp4';

@inject('stores')
@observer
export class SmokeVideo extends Component {
  getVideoStyle = () => {
    const {
      stores: { cigarettes }
    } = this.props;

    if (cigarettes <= 1) return { opacity: 0.2 };
    if (cigarettes < 5) return { opacity: 0.5 };
    if (cigarettes < 15) return { opacity: 0.7 };
    return { opacity: 1 };
  };

  render () {
    return (
      <Video
        isLooping
        resizeMode='cover'
        shouldPlay
        source={smokeVideo}
        style={[styles.video, this.getVideoStyle()]}
      />
    );
  }
}

const styles = StyleSheet.create({
  video: {
    bottom: 0,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    right: 0,
    width: Dimensions.get('screen').width,
    zIndex: -1
  }
});
