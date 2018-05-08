// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import axios from 'axios';
import { Constants } from 'expo';

const aqicn = async ({ latitude, longitude }) => {
  const { data: response } = await axios.get(
    `http://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${
      Constants.manifest.extra.waqiToken
    }`,
    { timeout: 6000 }
  );

  if (response.status === 'ok') {
    // ComponentDidCatch not working https://github.com/facebook/react-native/issues/18491
    // So we handle errors manually
    if (!response.data || !response.data.aqi) {
      throw new Error('AQI not defined in response.');
    }
    return response.data;
  } else {
    throw new Error(response.data);
  }
};

export default aqicn;
