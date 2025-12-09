import { openDb } from "../database/db";

export type ListingEntity = {
  id: number;
  title: string;
  price: number;
  category_id: number;
  desc: string;
  creation_date: number;
};

export type ListingWithData = ListingEntity & {
  image_url?: string | null;
  location_province?: string | null;
  location_district?: string | null;
  category_type_id?: number;
};

export async function getListingsByCategory(
  categoryId: number
): Promise<ListingEntity[]> {
  const database = await openDb();

  return await database.getAllAsync<ListingEntity>(
    "SELECT * FROM listing WHERE category_id = ? ORDER BY creation_date desc",
    [categoryId]
  );
}

export async function getListingsWithData(categoryId: number): Promise<ListingWithData[]> {
  const db = await openDb();

  const sql = `
    SELECT 
      l.*,
      img.url AS image_url,
      loc.province AS location_province,
      loc.district AS location_district,
      c.category_type_id          -- <-- category tablosundan alıyoruz
    FROM listing l
    LEFT JOIN image img 
      ON img.listing_id = l.id AND img.ui_order = 1
    LEFT JOIN location loc 
      ON loc.id = l.location_id
    LEFT JOIN category c
      ON c.id = l.category_id       -- <-- join
    WHERE l.category_id = ?
    ORDER BY l.id DESC;
  `;

  const rows = await db.getAllAsync<ListingWithData>(sql, [categoryId]);
  return rows ?? [];
}
