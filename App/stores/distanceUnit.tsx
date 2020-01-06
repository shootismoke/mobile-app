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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

import { i18n } from '../localization';

export type DistanceUnit = 'km' | 'mile';
type DistanceUnitFormat = 'short' | 'long';

const STORAGE_KEY = 'DISTANCE_UNIT';

interface ContextType {
  distanceUnit: DistanceUnit;
  setDistanceUnit: (distanceUnit: DistanceUnit) => void;
  localizedDistanceUnit: (format: DistanceUnitFormat) => string;
}

const Context = createContext<ContextType>({
  distanceUnit: 'km',
  localizedDistanceUnit: () => '',
  setDistanceUnit: () => {}
});

export function DistanceUnitProvider({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
    i18n.locale === 'en-US' ? 'mile' : 'km'
  );

  const getDistanceUnit = async (): Promise<void> => {
    const unit = await AsyncStorage.getItem(STORAGE_KEY);
    if (unit === 'km' || unit === 'mile') {
      setDistanceUnit(unit);
    }
  };

  const localizedDistanceUnit = (format: 'short' | 'long'): string =>
    distanceUnit === 'km'
      ? i18n.t(`distance_unit_${format}_km`)
      : i18n.t(`distance_unit_${format}_mi`);

  useEffect(() => {
    getDistanceUnit();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, distanceUnit);
  }, [distanceUnit]);

  return (
    <Context.Provider
      value={{ distanceUnit, setDistanceUnit, localizedDistanceUnit }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDistanceUnit = (): ContextType => useContext(Context);
