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

import { by, element, expect } from 'detox';
import { reloadApp } from 'detox-expo-helpers';

import { testIds } from '../App/util/testId';

describe('Location denied', () => {
  it(
    'should go to Error page if location not allowed',
    async () => {
      await reloadApp({
        permissions: { location: 'never' },
      });

      console.log('RELOADED');

      await expect(element(by.id(testIds.Error.screen))).toBeVisible();
    },
    30 * 60 * 1000
  );

  it('should show the error details', async () => {
    await reloadApp({
      permissions: { location: 'never' },
    });

    await element(by.id(testIds.Error.showDetails)).tap();
    await expect(element(by.id(testIds.Error.showDetails))).toHaveLabel(
      'Error: Permission to access location was denied'
    );
  });
});
