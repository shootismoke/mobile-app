// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import { Localization } from 'expo';
import i18n from 'i18n-js';

// languages
const en = require('./languages/en');
const fr = require('./languages/fr');

i18n.fallbacks = true;
i18n.translations = {
  en,
  fr
};
i18n.locale = Localization.locale;

export {
  i18n
};
