// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import axios from 'axios';

const windWaqi = async ({ latitude, longitude }) => {
  const { data: response } = await axios.get(
    `https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`,
    { timeout: 6000 }
  );

  if (response.d && response.d.length) {
    const data = response.d[0];
    return { aqi: data.v, city: { geo: data.geo, name: data.nlo } };
  } else {
    throw new Error(response);
  }
};

export default windWaqi;
