import { openDb } from "./db";

export type ImageEntity = {
  id: number;
  listing_id: number;
  url: string;
  alt: string | null;
  ui_order: number;
};

export async function getListingImages(listingId: number): Promise<ImageEntity[]> {
  const db = await openDb();
  const sql = `
    SELECT *
    FROM image
    WHERE listing_id = ?
    ORDER BY ui_order ASC
  `;
  const rows = await db.getAllAsync<ImageEntity>(sql, [listingId]);
  return rows ?? [];
}

export async function addListingImage(listingId: number, url: string, ui_order: number = 1) {
  const db = await openDb();

  await db.runAsync(
    `INSERT INTO image (listing_id, url, ui_order) VALUES (?, ?, ?)`,
    [listingId, url, ui_order]
  );
}
