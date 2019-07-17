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

import { SQLite } from 'expo-sqlite';
import { array, flatten } from 'fp-ts/lib/Array';
import * as C from 'fp-ts/lib/Console';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../stores/fetchGpsPosition';
import { pm25ToCigarettes } from '../stores/fetchApi/dataSources/pm25ToCigarettes';
import { sideEffect, toError } from '../util/fp';

// FIXME correct types
type Database = any;
type ResultSet = any;
type Transaction = any;

interface AqiHistoryDbItemInput extends LatLng {
  rawPm25: number;
}

export interface AqiHistoryDbItem extends AqiHistoryDbItemInput {
  creationTime: string;
  id: number;
}

export const SAVE_DATA_INTERVAL = 3 * 3600; // 3 hours in s
const AQI_HISTORY_DB = 'AQI_HISTORY_DB';
const AQI_HISTORY_TABLE = 'AqiHistory';

/**
 * Open database and create (if not exists) the AqiHistory table.
 */
function initDb () {
  return pipe(
    TE.rightTask(T.of(SQLite.openDatabase(AQI_HISTORY_DB) as Database)),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              tx.executeSql(
                `
                  CREATE TABLE IF NOT EXISTS ${AQI_HISTORY_TABLE}(
                  id INTEGER PRIMARY KEY,
                  latitude REAL NOT NULL,
                  longitude REAL NOT NULL,
                  rawPm25 REAL NOT NULL,
                  creationTime DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
                [],
                () => resolve(db),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<Database>,
        toError
      )
    )
  );
}

/**
 * Fetch the db
 */
function getDb () {
  // TODO Only do initDb once (although that operation is idempotent)
  return initDb();
}

/**
 * Check if we need to save a new entry (every `SAVE_DATA_INTERVAL`)
 */
function isSaveNeeded () {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              // Get time of `SAVE_DATA_INTERVAL`ms before now
              const now = new Date();
              now.setMilliseconds(now.getMilliseconds() - SAVE_DATA_INTERVAL);

              tx.executeSql(
                `
                  SELECT * FROM ${AQI_HISTORY_TABLE}
                  WHERE creationTime > datetime(?)
                  LIMIT 1
                `,
                [now.toISOString()],
                (_transaction: Transaction, resultSet: ResultSet) => {
                  if (resultSet.rows.length > 0) {
                    try {
                      console.log(
                        `<AqiHistoryDb> - isSaveNeeded - false: last save happened at ${
                          resultSet.rows.item(0).creationTime
                        }`
                      );
                    } catch (err) {
                      // It shouldn't catch, but we're never too sure
                      reject(err);
                    }
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                },
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<boolean>,
        toError
      )
    )
  );
}

/**
 * Add a new row in the table
 *
 * @param value - The entry to add.
 */
export function saveData (value: AqiHistoryDbItemInput) {
  return pipe(
    isSaveNeeded(),
    TE.chain(isNeeded =>
      TE.rightIO(
        sideEffect(
          C.log(`<AqiHistoryDb> - saveData - isSaveNeeded=${isNeeded}`),
          isNeeded
        )
      )
    ),
    TE.chain(isNeeded =>
      isNeeded ? TE.right(undefined) : TE.left(new Error('Canceling saveData'))
    ),
    TE.chain(() => getDb()),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              console.log(
                `<AqiHistoryDb> - saveData - Inserting new row in ${AQI_HISTORY_TABLE} with values ${JSON.stringify(
                  value
                )}`
              );

              tx.executeSql(
                `
                  INSERT INTO ${AQI_HISTORY_TABLE}
                  (latitude, longitude, rawPm25)
                  VALUES (?, ?, ?)
                `,
                [value.latitude, value.longitude, value.rawPm25],
                () => resolve(),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<void>,
        toError
      )
    )
  );
}

/**
 * Get the PM25 data since `date`.
 *
 * @param date - The date to start calculating the PM25.
 */
export function getData (date: Date) {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              tx.executeSql(
                `
                  SELECT * FROM ${AQI_HISTORY_TABLE}
                  WHERE creationTime > datetime(?)
                  ORDER BY id DESC
                `,
                [date.toISOString()],
                (_transaction: Transaction, resultSet: ResultSet) => {
                  console.log(
                    `<AqiHistoryDb> - getData - ${
                      resultSet.rows.length
                    } results since ${date.toISOString()}`
                  );
                  resolve(resultSet.rows._array);
                },

                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<AqiHistoryDbItem[]>,
        toError
      )
    )
  );
}

function getSum (data: number[]) {
  return data.reduce((sum, current) => sum + current, 0);
}

export interface AqiHistory {
  pastMonth: O.Option<number>;
  pastWeek: O.Option<number>;
}

/**
 * Get data from past week and past month
 */
export function getAqiHistory () {
  const oneWeekAgo = new Date();
  oneWeekAgo.setHours(oneWeekAgo.getHours() - 7 * 24);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Add a bit of buffer. The idea is that we take from the DB all data from the
  // past week/month, but also require that the 1st sample falls inside the time
  // buffers defined belowed, so that we don't only have too recent data.
  const oneWeekAgoBuffer = new Date(oneWeekAgo);
  oneWeekAgoBuffer.setHours(oneWeekAgo.getHours() + 24);
  const oneMonthAgoBuffer = new Date(oneWeekAgo);
  oneWeekAgoBuffer.setHours(oneWeekAgo.getHours() + 24);

  return pipe(
    array.sequence(TE.taskEither)([getData(oneWeekAgo), getData(oneMonthAgo)]),
    TE.map(([pastWeekData, pastMonthData]) => {
      const weekOption =
        pastWeekData[0] &&
        new Date(pastWeekData[0].creationTime) <= oneWeekAgoBuffer
          ? O.some(pastWeekData)
          : O.none;
      const monthOption =
        pastMonthData[0] &&
        new Date(pastMonthData[0].creationTime) <= oneMonthAgoBuffer
          ? O.some(pastMonthData)
          : O.none;

      return [weekOption, monthOption];
    }),
    TE.map(([pastWeekData, pastMonthData]) => [
      pipe(
        pastWeekData,
        O.map(v => v.map(({ rawPm25 }) => rawPm25))
      ),
      pipe(
        pastMonthData,
        O.map(v => v.map(({ rawPm25 }) => rawPm25))
      )
    ]),
    TE.map(([pastWeekData, pastMonthData]) => [
      O.map(getSum)(pastWeekData),
      O.map(getSum)(pastMonthData)
    ]),
    TE.map(([pastWeekData, pastMonthData]) => [
      O.map(pm25ToCigarettes)(pastWeekData),
      O.map(pm25ToCigarettes)(pastMonthData)
    ]),
    TE.map(
      ([pastWeek, pastMonth]) =>
        ({
          pastWeek,
          pastMonth
        } as AqiHistory)
    )
  );
}

/**
 * Clears the whole db. DANGEROUS.
 */
export function clearTable () {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              tx.executeSql(
                `DROP TABLE ${AQI_HISTORY_TABLE}`,
                [],
                () => resolve(undefined as void),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<void>,
        toError
      )
    )
  );
}

export function populateRandom () {
  const randomValues = flatten(
    [...Array(30)].map((_, i) => [
      0,
      0,
      Math.floor(Math.random() * 20 + 1),
      new Date(new Date().setDate(new Date().getDate() - i - 1)).toISOString()
    ])
  );

  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              tx.executeSql(
                `
                  INSERT INTO ${AQI_HISTORY_TABLE}
                  (latitude, longitude, rawPm25, creationTime)
                  VALUES
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?),
                  (?, ?, ?, ?)
                `,
                randomValues,
                () => resolve(),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<void>,
        toError
      )
    )
  );
}
