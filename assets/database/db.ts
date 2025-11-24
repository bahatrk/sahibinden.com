import * as SQLite from 'expo-sqlite';

// TypeScript için tip override
export const db = SQLite.openDatabaseSync('sahibinden.db');

export const getIlanlar = async (callback: (rows: any[]) => void) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM ilanlar');
    callback(allRows);
  } catch (error) {
    console.log('DB Hata:', error);
  }
};
