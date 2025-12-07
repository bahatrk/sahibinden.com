import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function openDb() {
  if (!db) {
    console.log('Open DB')
    db = await SQLite.openDatabaseAsync('sahibinden.db');
  }
  console.log('Opened DB')
  return db;
}
