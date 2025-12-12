// lib/database/realEstateDetail.ts
import { openDb } from "./db";

export type RealEstateDetailEntity = {
  listing_id: number;
  room_number: number;
  bathroom_number: number;
  square_meter: number;
  floor: number;
  building_age: number;
  furnished: boolean;

  // JOIN ile gelebilecek alan
  desc?: string | null;
};

export async function getRealEstateDetail(listingId: number): Promise<RealEstateDetailEntity | null> {
  const db = await openDb();

  // 1) Önce JOIN'li dene (listing.description ile)
  const sqlJoin = `
    SELECT 
      red.*,
      l.desc
    FROM real_estate_detail red
    JOIN listing l ON l.id = red.listing_id
    WHERE red.listing_id = ?
  `;

  try {
    const rows = await db.getAllAsync<RealEstateDetailEntity>(sqlJoin, [listingId]);
    console.log("getRealEstateDetail - JOIN rows:", rows);
    if (rows && rows.length > 0) {
      const r = rows[0];
      // normalize: description alanı varsa atıyoruz
      return {
        ...r,
        desc: (r as any).desc ?? null,
      };
    }
  } catch (err) {
    console.error("getRealEstateDetail - JOIN error:", err);
  }

  // 2) JOIN başarısızsa fallback: sadece real_estate_detail al
  try {
    const sqlRaw = `SELECT * FROM real_estate_detail WHERE listing_id = ?`;
    const rawRows = await db.getAllAsync<RealEstateDetailEntity>(sqlRaw, [listingId]);
    console.log("getRealEstateDetail - RAW rows:", rawRows);
    if (rawRows && rawRows.length > 0) return rawRows[0];
  } catch (err) {
    console.error("getRealEstateDetail - RAW error:", err);
  }

  return null;
}
