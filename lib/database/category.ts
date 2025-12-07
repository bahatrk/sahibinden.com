import { openDb } from '../database/db';

export type CategoryEntity = {
  id: number;
  name: string;
  parent_id: number | null;
  category_type_id: number;
  desc: string | null;
};

export async function getChildCategories(parentId: number | null): Promise<CategoryEntity[]> {
  const database = await openDb();

  if (parentId === null) {
    // top-level categories
    return await database.getAllAsync<CategoryEntity>(
      'SELECT * FROM category WHERE parent_id IS NULL', []
    );
  } else {
    return await database.getAllAsync<CategoryEntity>(
      'SELECT * FROM category WHERE parent_id = ?', [parentId]
    );
  }
}
