import { openDb } from '../database/db';

export type CategoryEntity = {
  id: number;
  name: string;
  parent_id: number | null;
  category_type_id: number;
  desc: string | null;
  logo_id: number | null;      // yeni
  logo_url?: string | null;    // yeni, join ile logosu gelecek
};
export type CategoryAdminEntity = CategoryEntity & {
  is_active:boolean
};

export async function getChildCategories(parentId: number | null): Promise<CategoryEntity[]> {
  const database = await openDb();

  const sql = `
    SELECT c.*, l.url AS logo_url
    FROM category c
    LEFT JOIN logo_image l ON c.logo_id = l.id
    ${parentId === null ? 'WHERE c.parent_id IS NULL' : 'WHERE c.parent_id = ?'}
  `;

  const params = parentId === null ? [] : [parentId];

  return await database.getAllAsync<CategoryEntity>(sql, params) ?? [];
}
