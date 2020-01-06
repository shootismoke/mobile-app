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

import React, { createContext, useState } from 'react';

import { Frequency } from '../Screens/Home/SelectFrequency';
import { noop } from '../util/noop';

interface Context {
  frequency: Frequency;
  setFrequency: (newFrequency: Frequency) => void;
}

export const FrequencyContext = createContext<Context>({
  frequency: 'daily',
  setFrequency: noop
});

export function FrequencyContextProvider({
  children
}: {
  children: JSX.Element;
}): React.ReactElement {
  const [frequency, setFrequency] = useState<Frequency>('daily');

  return (
    <FrequencyContext.Provider
      value={{
        frequency,
        setFrequency
      }}
    >
      {children}
    </FrequencyContext.Provider>
  );
}
