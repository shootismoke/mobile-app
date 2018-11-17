// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

/* eslint-env jest */

import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
