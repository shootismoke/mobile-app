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

import {
  addDays,
  differenceInCalendarDays,
  differenceInSeconds
} from 'date-fns';
import { SQLite } from 'expo-sqlite';
import { array, flatten } from 'fp-ts/lib/Array';
import * as C from 'fp-ts/lib/Console';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../stores/fetchGpsPosition';
import { pm25ToCigarettes } from '../stores/fetchApi/dataSources/pm25ToCigarettes';
import { sqlToJsDate } from './util/sqlToJsDate';
import { sideEffect, toError } from '../util/fp';
import { ONE_WEEK_AGO, ONE_MONTH_AGO, NOW } from '../util/time';

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
                  ORDER BY creationTime DESC
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
                    const timeDiff = differenceInSeconds(
                      NOW,
                      sqlToJsDate(resultSet.rows.item(0).creationTime)
                    );

                    if (timeDiff <= SAVE_DATA_INTERVAL) {
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
                  ORDER BY creationTime DESC
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

interface AqiHistorySummary {
  daysToResults: O.Option<number>;
  firstResult: Date;
  isCorrect: boolean;
  lastResult: Date;
  numberOfResults: number;
  sum: number;
}

export interface AqiHistory {
  monthly: AqiHistorySummary;
  weekly: AqiHistorySummary;
}

// TODO Calculate integral instead of sum
function getSum (data: number[]) {
  return data.reduce((sum, current) => sum + current, 0);
}

/**
 * From historical data, derive a summary
 */
function computeSummary (
  pastData: AqiHistoryDbItem[],
  weekOrMonth: keyof AqiHistory
): AqiHistorySummary {
  const firstResult = sqlToJsDate(pastData[pastData.length - 1].creationTime);

  // We add some buffer to compute `daysUntilResults`. The idea is that we want
  // the first result in our db to be really one week or one month ago, +/- 1
  // day.
  const oneWeekOrMonthAgo = addDays(
    weekOrMonth === 'weekly' ? ONE_WEEK_AGO : ONE_MONTH_AGO,
    1
  );

  // const firstResult.getTime() - oneWeekOrMonthAgo.getTime() <= 0
  const daysToResults = pipe(
    differenceInCalendarDays(firstResult, oneWeekOrMonthAgo),
    O.fromPredicate(days => days >= 0)
  );

  return {
    daysToResults,
    firstResult,
    lastResult: sqlToJsDate(pastData[0].creationTime),
    isCorrect: O.isNone(daysToResults),
    numberOfResults: pastData.length,
    sum: pm25ToCigarettes(getSum(pastData.map(({ rawPm25 }) => rawPm25)))
  };
}

/**
 * Get data from past week and past month
 */
export function getAqiHistory () {
  return pipe(
    array.sequence(TE.taskEither)([
      getData(ONE_WEEK_AGO),
      getData(ONE_MONTH_AGO)
    ]),
    TE.map(
      ([pastWeekData, pastMonthData]) =>
        ({
          monthly: computeSummary(pastMonthData, 'monthly'),
          weekly: computeSummary(pastWeekData, 'weekly')
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
                  (?, ?, ?, ?, ?, ?, ?)
                `,
                randomValues,
                () => {
                  console.log(
                    '<AqiHistoryDb> - populateRandom - Successfully populated random data'
                  );
                  resolve();
                },
                (_transaction: Transaction, error: Error) => reject(error)
              );
            }, reject);
          }) as Promise<void>,
        toError
      )
    )
  );
}
