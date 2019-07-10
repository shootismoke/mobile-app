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
import * as C from 'fp-ts/lib/Console';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { LatLng } from '../stores';
import { sideEffect, toError } from '../util/fp';

// FIXME correct types
type Database = any;
type ResultSet = any;
type Transaction = any;

interface AqiHistoryItemInput extends LatLng {
  rawPm25: number;
}

interface AqiHistoryItem extends AqiHistoryItemInput {
  creationTime: Date;
  id: number;
}

export const SAVE_DATA_INTERVAL = 360000 * 1000; // 1 hour
const AQI_HISTORY_DB = 'AQI_HISTORY_DB';
const AQI_HISTORY_TABLE = 'AqiHistory';

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
            });
          }) as Promise<Database>,
        toError
      )
    )
  );
}

function getDb () {
  // TODO Only do initDb once (although that operation is idempotent)
  return initDb();
}

function isSaveNeeded () {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.readTransaction((tx: Transaction) => {
              // Get time of `SAVE_DATA_INTERVAL`ms before now
              const now = new Date();
              now.setMilliseconds(now.getMilliseconds() - SAVE_DATA_INTERVAL);

              tx.executeSql(
                `
                  SELECT * FROM ${AQI_HISTORY_TABLE}
                  WHERE creationTime > ?
                  LIMIT 1
                `,
                [now.getTime() / 1000],
                (_transaction: Transaction, resultSet: ResultSet) => {
                  if (resultSet.rows.length > 0) {
                    try {
                      console.log(
                        `<AqiHistoryDb> - isSaveNeeded - Last save happened at ${
                          resultSet.rows.item(0).creationTime
                        }`
                      );
                    } catch (err) {
                      reject(err);
                    }
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                },
                (_transaction: Transaction, error: Error) => reject(error)
              );
            });
          }) as Promise<boolean>,
        toError
      )
    )
  );
}

export function saveData (value: AqiHistoryItemInput) {
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
                `INSERT INTO ${AQI_HISTORY_TABLE} (latitude, longitude, rawPm25) VALUES (?, ?, ?)`,
                [value.latitude, value.longitude, value.rawPm25],
                () => resolve(),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            });
          }) as Promise<void>,
        toError
      )
    )
  );
}

export function getAveragePm25 (date: Date) {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.readTransaction((tx: Transaction) => {
              console.log(
                `<AqiHistoryDb> - getAveragePm25 - Reading data since ${date.toISOString()}`
              );

              tx.executeSql(
                `
                  SELECT AVG(rawPm25) FROM ${AQI_HISTORY_TABLE}
                  WHERE creationTime > ?
                `,
                [date.getTime() / 1000],
                (_transaction: Transaction, resultSet: ResultSet) =>
                  resolve(resultSet.rows.item(0)),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            });
          }) as Promise<number>,
        toError
      )
    )
  );
}

/**
 * Get the `limit` last results in the db. Is only used for testing purposes for
 * now.
 *
 * @param limit - The number of results we want to take.
 */
export function getData (limit: number) {
  return pipe(
    getDb(),
    TE.chain(db =>
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            db.readTransaction((tx: Transaction) => {
              tx.executeSql(
                `
                  SELECT * FROM ${AQI_HISTORY_TABLE}
                  LIMIT ?
                `,
                [limit],
                (_transaction: Transaction, resultSet: ResultSet) =>
                  resolve(resultSet.rows._array),
                (_transaction: Transaction, error: Error) => reject(error)
              );
            });
          }) as Promise<AqiHistoryItem[]>,
        toError
      )
    )
  );
}
