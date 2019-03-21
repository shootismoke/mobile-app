// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import { types } from 'mobx-state-tree';

export const ErrorStore = types.union(types.string, types.undefined);
