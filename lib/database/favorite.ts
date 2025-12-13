import { openDb } from "./db";
import { ListingWithData } from "./listing";

export interface FavoriteEntity {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
}

/* Favoriye ekle */
export async function addFavorite(userId: number, listingId: number) {
  const db = await openDb();
  await db.runAsync(
    `INSERT INTO favorite (user_id, listing_id)
     VALUES (?, ?)`,
    [userId, listingId]
  );
}

/* Favoriden çıkar */
export async function removeFavorite(userId: number, listingId: number) {
  const db = await openDb();
  await db.runAsync(
    `DELETE FROM favorite
     WHERE user_id = ? AND listing_id = ?`,
    [userId, listingId]
  );
}

/* Bu ilan favori mi? */
export async function isFavorite(
  userId: number,
  listingId: number
): Promise<boolean> {
  const db = await openDb();
  const row = await db.getFirstAsync(
    `SELECT id FROM favorite
     WHERE user_id = ? AND listing_id = ?`,
    [userId, listingId]
  );

  return !!row;
}

/* Kullanıcının favori ilanları */
export async function getUserFavorites(userId: number): Promise<ListingWithData[]> {
  const db = await openDb();
  const sql = `
    SELECT 
      l.*,
      img.url AS image_url,
      p.name AS location_province,
      d.name AS location_district,
      c.category_type_id
    FROM favorite f
    JOIN listing l ON l.id = f.listing_id
    LEFT JOIN image img 
      ON img.listing_id = l.id AND img.ui_order = 1
    LEFT JOIN location loc 
      ON loc.id = l.location_id
    LEFT JOIN province p
      ON p.id = loc.province_id
    LEFT JOIN district d
      ON d.id = loc.district_id
    LEFT JOIN category c
      ON c.id = l.category_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;

  const rows = await db.getAllAsync<ListingWithData>(sql, [userId]);
  return rows ?? [];
}


