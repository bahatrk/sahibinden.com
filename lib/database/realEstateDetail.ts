import { openDb } from "./db";

export type RealEstateDetailEntity = {
  listing_id: number;
  room_number: number;
  bathroom_number: number;
  square_meter: number;
  floor: number;
  building_age: number;
  furnished: boolean;
};

// listingId ile real_estate_detail çek
export async function getRealEstateDetail(listingId: number): Promise<RealEstateDetailEntity | null> {
  const db = await openDb();

  const sql = `
    SELECT *
    FROM real_estate_detail
    WHERE listing_id = ?
  `;

  const rows = await db.getAllAsync<RealEstateDetailEntity>(sql, [listingId]);

  return rows && rows.length > 0 ? rows[0] : null;
}
