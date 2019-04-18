import { SQLite } from 'expo';

export const SAVE_DATA_INTERVAL = 3600000; // 1 hour
const DB_AQI_HISTORY = "aqi-history";

export const initDb = () => {
    return SQLite.openDatabase(DB_AQI_HISTORY, '1.0', 'Aqi History', 5*1024*1024);
};

export const init = async () => {
    const db = await initDb();

    await db.transaction((tx) => {
        tx.executeSql(
            "create table if not exists history(id integer not null, location varchar(255) not null, rawPm25 decimal not null, creation_time timestamp not null, primary key (id))",
            [],
            () => {},
            (transaction, error) => console.log("DB init error", error)
        );
    });

    return db;
};

export const isSaveNeeded = async () => {
    const db = await init();

    const promise = new Promise((resolve, reject) => {
        db.readTransaction((tx) => {
            tx.executeSql(
                "select * from history order by id desc limit 1",
                [],
                (transaction, resultSet) => {
                    if (resultSet.rows.length === 0) {
                        resolve(true);
                    } else if ((resultSet.rows.item(0).creation_time + SAVE_DATA_INTERVAL) < Date.now()) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (transaction, error) => reject(error)
            );
        });
    });

    return promise;
};

export const saveData = async (location, rawPm25) => {
    const db = await init();

    db.transaction((tx) => {
       tx.executeSql(
           "insert into history (id, location, rawPm25, creation_time) values (?, ?, ?, ?)",
           [Date.now(), location, rawPm25, Date.now()],
           () => {},
           ((transaction, error) => console.log("DB insert error", error))
       );
    });
};

export const getData = async (limit) => {
    const db = await init();

    const promise = new Promise((resolve, reject) => {
        db.readTransaction((tx) => {
            tx.executeSql(
                "select * from history order by creation_time desc limit " + limit,
                [],
                ((transaction, resultSet) => {
                    let data = [];

                    for (let i = 0; i < resultSet.rows.length; i++) {
                        data.push(resultSet.rows.item(i));
                    }

                    resolve(data);
                }),
                ((transaction, error) => reject(error))
            );
        });
    });

    return promise;
};
