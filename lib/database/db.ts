import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system/legacy";

import * as Sharing from "expo-sharing";
 
const SQLITE_DIR = FileSystem.documentDirectory + "SQLite/";
const DB_NAME = "sahibinden.db";

let db: SQLite.SQLiteDatabase;

export async function openDb() {
  if (!db) {
    console.log('Open DB')
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  console.log('Opened DB')
  return db;
}

 
export async function exportDatabase() {

  const dbPath = SQLITE_DIR + DB_NAME;
 
  const info = await FileSystem.getInfoAsync(dbPath);

  if (!info.exists) {

    throw new Error("DB not found: " + dbPath);

  }
 
  await Sharing.shareAsync(dbPath);
  console.log(dbPath);

}

 