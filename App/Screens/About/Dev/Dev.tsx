// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

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

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { AqiHistoryItem, getData } from '../../../managers/AqiHistoryDb';
import * as theme from '../../../util/theme';

export function Dev () {
  const [allData, setAllData] = useState<AqiHistoryItem[]>([]);

  useEffect(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setHours(oneWeekAgo.getHours() - 24 * 7);

    pipe(
      getData(oneWeekAgo),
      TE.fold(
        err => {
          console.log(err);
          return T.of(undefined);
        },
        data => {
          setAllData(data);
          return T.of(undefined);
        }
      )
    )();
  }, []);

  // FIXME Calculate integral instead of average
  const average =
    allData.reduce((sum, current) => sum + current.rawPm25, 0) / allData.length;

  return (
    <View>
      <Text style={theme.text}>Average: {average}</Text>
      <Text style={theme.text}>All data: {JSON.stringify(allData)}</Text>
    </View>
  );
}
