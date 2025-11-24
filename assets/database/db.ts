import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

// TypeScript için tip override
export const db = SQLite.openDatabaseSync(
  FileSystem.documentDirectory + "SQLite/sahibinden.db"
);

export const getIlanlar = async (callback: (rows: any[]) => void) => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM ilanlar');
    console.log("DB’den çekilen tüm satırlar:", allRows); // 🔹 burayı ekle
    callback(allRows);
  } catch (error) {
    console.log('DB Hata:', error);
  }
};
