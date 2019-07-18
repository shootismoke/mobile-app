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
  station: string;
  city?: string;
  country?: string;
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
                  CREATE TABLE IF NOT EXISTS ${AQI_HISTORY_TABLE} (
                    id INTEGER PRIMARY KEY,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    rawPm25 REAL NOT NULL,
                    station TEXT,
                    city TEXT,
                    country TEXT,
                    creationTime DATETIME DEFAULT CURRENT_TIMESTAMP
                  );
                `,
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
              tx.executeSql(
                `
                  SELECT * FROM ${AQI_HISTORY_TABLE}
                  ORDER BY id DESC
                  LIMIT 1
                `,
                [],
                (_transaction: Transaction, resultSet: ResultSet) => {
                  try {
                    if (resultSet.rows.length === 0) {
                      return resolve(true);
                    }

                    // Get the time difference (in ms) between now and last saved
                    // item in the db
                    const timeDiff =
                      new Date().getTime() -
                      new Date(
                        resultSet.rows.item(0).creationTime.replace(' ', 'T')
                      ).getTime();
                    if (timeDiff / 1000 <= SAVE_DATA_INTERVAL) {
                      console.log(
                        `<AqiHistoryDb> - last save happened at ${
                          resultSet.rows.item(0).creationTime
                        }`
                      );
                      resolve(false);
                    } else {
                      resolve(true);
                    }
                  } catch (err) {
                    // It shouldn't throw, but we're never too sure
                    reject(err);
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
    TE.filterOrElse(
      isNeeded => isNeeded,
      () => new Error('Canceling saveData because isSaveNeeded=false')
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
                  (latitude, longitude, rawPm25, station, city, country)
                  VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                  value.latitude,
                  value.longitude,
                  value.rawPm25,
                  value.station,
                  value.city,
                  value.country
                ],
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

// TODO Calculate integral instead of sum
function getSum (data: number[]) {
  return data.reduce((sum, current) => sum + current, 0);
}

interface AqiHistorySummary {
  firstResult: Date;
  lastResult: Date;
  sum: number;
}

export interface AqiHistory {
  pastMonth: AqiHistorySummary;
  pastWeek: AqiHistorySummary;
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
  const oneMonthAgoBuffer = new Date(oneMonthAgo);
  oneMonthAgoBuffer.setHours(oneMonthAgo.getHours() + 24);

  return pipe(
    array.sequence(TE.taskEither)([getData(oneWeekAgo), getData(oneMonthAgo)]),
    TE.map(
      ([pastWeekData, pastMonthData]) =>
        ({
          pastMonth: {
            firstResult: new Date(
              pastMonthData[pastMonthData.length - 1].creationTime
            ),
            lastResult: new Date(pastMonthData[0].creationTime),
            sum: pm25ToCigarettes(
              getSum(pastMonthData.map(({ rawPm25 }) => rawPm25))
            )
          },
          pastWeek: {
            firstResult: new Date(
              pastWeekData[pastWeekData.length - 1].creationTime
            ),
            lastResult: new Date(pastWeekData[0].creationTime),
            sum: pm25ToCigarettes(
              getSum(pastWeekData.map(({ rawPm25 }) => rawPm25))
            )
          }
        } as AqiHistory)
    )
  );
}

/**
 * Clears the whole db. DANGEROUS.
 */
export function clearTable () {
  return pipe(
    TE.rightIO(
      C.log(`<AqiHistoryDb> - clearTable - Dropping table ${AQI_HISTORY_TABLE}`)
    ),
    TE.chain(getDb),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
              tx.executeSql(
                `DROP TABLE ${AQI_HISTORY_TABLE};`,
                [],
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

export function populateRandom () {
  const randomValues = flatten(
    [...Array(30)].map((_, i) => [
      0,
      0,
      Math.floor(Math.random() * 20 + 1),
      `some station ${Math.floor(Math.random() * 10 + 1)}`,
      `some city ${Math.floor(Math.random() * 10 + 1)}`,
      `some country ${Math.floor(Math.random() * 10 + 1)}`,
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
                  (latitude, longitude, rawPm25, station, city, country, creationTime)
                  VALUES
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?, ?, ?),
                  (?, ?, ?, ?, ?)
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
