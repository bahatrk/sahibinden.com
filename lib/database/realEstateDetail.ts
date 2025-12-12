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
  heat: string;
  kitchen: string;
  lift: number;
  car_park: number;

  // Listing'den gelen alanlar
  price?: number;
  creation_date?: string;
  desc?: string | null;
};

export async function getRealEstateDetail(listingId: number): Promise<RealEstateDetailEntity | null> {
  const db = await openDb();

  const sql = `
    SELECT
      red.*,
      l.price,
      l.creation_date,
      l.desc
    FROM real_estate_detail red
    JOIN listing l ON l.id = red.listing_id
    WHERE red.listing_id = ?
  `;

  try {
    const rows = await db.getAllAsync<RealEstateDetailEntity>(sql, [listingId]);
    console.log("getRealEstateDetail - JOIN rows:", rows);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        ...r,
        price: r.price,
        creation_date: r.creation_date,
        desc: r.desc ?? null,
      };
    }
  } catch (err) {
    console.error("getRealEstateDetail - error:", err);
  }

  return null;
}
