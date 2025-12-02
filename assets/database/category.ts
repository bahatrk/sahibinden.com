import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

async function openDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('sahibinden.db');
  }
  return db;
}

export type Category = {
  id: number;
  adi: string;
  parent_id: number | null;
};

export async function getChildCategories(parentId: number | null): Promise<Category[]> {
  const database = await openDb();

  if (parentId === null) {
    // top-level categories
    return await database.getAllAsync<Category>(
      'SELECT * FROM kategoriler WHERE parent_id IS NULL', []
    );
  } else {
    return await database.getAllAsync<Category>(
      'SELECT * FROM kategoriler WHERE parent_id = ?', [parentId]
    );
  }
}
