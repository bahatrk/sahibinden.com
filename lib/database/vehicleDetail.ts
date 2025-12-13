import { openDb } from "./db";

export type VehicleDetailEntity = {
  listing_id: number;

  // brand_id: number;
  // model_id: number;
  // serial_id: number;

  // brand_name: string | null;
  // model_name: string | null;
  // serial_name: string | null;

  year: number;
  fuel: string;
  transmission: string;
  kilometer: number;
  body_type: string;
  engine_cc: string;
  instrumental: string;
  color: string;

  // JOIN listing
  price: number;
  creation_date: number;
  desc: string;
};

// listingId ile real_estate_detail çek
export async function getVehicleDetail(listingId: number): Promise<VehicleDetailEntity | null> {
  const db = await openDb();

  const sql = `
    SELECT
      vd.*,
      l.price,
      l.creation_date,
      l.desc
    FROM vehicle_detail vd
    LEFT JOIN listing l ON l.id = vd.listing_id
    WHERE vd.listing_id = ?
  `;

  try {
    const rows = await db.getAllAsync<VehicleDetailEntity>(sql, [listingId]);
    console.log("getVehicleDetail - JOIN rows:", rows);
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
    console.error("getVehicleDetail - error:", err);
  }

  return null;
}

export async function createVehicleDetail(listingId: number, detail: {
  year: number;
  fuel: string;
  transmission: string;
  kilometer: number;
  body_type: string;
  engine_cc: string;
  instrumental: string;
  color: string;
}) {
  const db = await openDb();

  await db.runAsync(
    `INSERT INTO vehicle_detail
     (listing_id, year, fuel, transmission, kilometer, body_type, engine_cc, instrumental, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      listingId,
      detail.year,
      detail.fuel,
      detail.transmission,
      detail.kilometer,
      detail.body_type,
      detail.engine_cc,
      detail.instrumental,
      detail.color
    ]
  );
}
