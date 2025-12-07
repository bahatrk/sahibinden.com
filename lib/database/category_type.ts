import * as SQLite from 'expo-sqlite';
import { openDb } from './db';

export type CategoryType = {
  id: number;
  name: string;
};

export async function getCategoryType(id: number ): Promise<CategoryType | null> {
  const database = await openDb();

  return await database.getFirstAsync<CategoryType>(
      'SELECT * FROM category_type WHERE id = ?', [id]
    );
}
