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


export async function createRealEstateDetail(listingId: number, detail: {
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
}) {
  const db = await openDb();

  await db.runAsync(
    `INSERT INTO real_estate_detail
     (listing_id, room_number, bathroom_number, square_meter, floor, building_age, furnished, heat, kitchen, lift, car_park)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      listingId,
      detail.room_number,
      detail.bathroom_number,
      detail.square_meter,
      detail.floor,
      detail.building_age,
      detail.furnished ? 1 : 0,
      detail.heat,
      detail.kitchen,
      detail.lift,
      detail.car_park
    ]
  );
}

