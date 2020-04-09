import { by, element, expect } from 'detox';
import { reloadApp } from 'detox-expo-helpers';

import { testIds } from '../App/util/testId';

describe('Example', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should have "cough..." text', async () => {
    await expect(element(by.id(testIds.Loading.coughText))).toBeVisible();
  });
});
