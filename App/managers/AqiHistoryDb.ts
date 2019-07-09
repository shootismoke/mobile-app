import { SQLite } from 'expo-sqlite';

import { LatLng } from '../stores';

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

let db: Database | undefined;

export const SAVE_DATA_INTERVAL = 36; // 1 hour
const AQI_HISTORY_DB = 'AQI_HISTORY_DB';
const AQI_HISTORY_TABLE = 'AqiHistory';

async function initDb() {
  console.log(`<AqiHistoryDb> - initDb - Open database ${AQI_HISTORY_DB}`);
  await SQLite.openDatabase(AQI_HISTORY_DB);

  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      console.log(
        `<AqiHistoryDb> - initDb - Creating (if not exists) table ${AQI_HISTORY_TABLE}`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISYS ${AQI_HISTORY_TABLE}(
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
  }) as Promise<Database>;
}

async function init() {
  if (db) {
    return db;
  }

  return initDb();
}

async function isSaveNeeded() {
  const db = await init();

  return new Promise((resolve, reject) => {
    db.readTransaction((tx: Transaction) => {
      console.log(
        `<AqiHistoryDb> - isSaveNeeded - Checking if is saved needed`
      );

      tx.executeSql(
        `SELECT * FROM ${AQI_HISTORY_TABLE} ORDER BY id DESC LIMIT 1`,
        [],
        (_transaction: Transaction, resultSet: ResultSet) => {
          if (resultSet.rows.length === 0) {
            resolve(true);
          } else if (
            resultSet.rows.item(0).creationTime + SAVE_DATA_INTERVAL <
            Date.now()
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_transaction: Transaction, error: Error) => reject(error)
      );
    });
  }) as Promise<boolean>;
}

export async function saveData(value: AqiHistoryItemInput) {
  const db = await init();
  const isNeeded = await isSaveNeeded();

  console.log(`<AqiHistoryDb> - saveData - isSaveNeeded=${isNeeded}`);
  if (!isNeeded) {
    return false;
  }

  return new Promise((resolve, reject) => {
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
  });
}

export async function getData(date: Date) {
  const db = await init();

  return new Promise((resolve, reject) => {
    db.readTransaction((tx: Transaction) => {
      console.log(
        `<AqiHistoryDb> - getData - Reading data since ${date.toISOString()}`
      );

      tx.executeSql(
        `SELECT * FROM ${AQI_HISTORY_TABLE}
        WHERE creationTime > ?,
        ORDER BY creationTime`,
        [date],
        (_transaction: Transaction, resultSet: ResultSet) => {
          let data = [];

          for (let i = 0; i < resultSet.rows.length; i++) {
            const result = resultSet.rows.item(i) as AqiHistoryItem;
            data.push(result);
          }

          resolve(data);
        },
        (_transaction: Transaction, error: Error) => reject(error)
      );
    });
  });
}
