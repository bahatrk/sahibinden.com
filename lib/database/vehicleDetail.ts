import { openDb } from "./db";

export type VehicleDetailEntity = {
  listing_id: number;

  brand_id: number;
  model_id: number;
  serial_id: number;

  brand_name: string | null;
  model_name: string | null;
  serial_name: string | null;

  year: number;
  fuel: string;
  transmission: string;
  kilometer: number;
  body_type: string;
  engine_cc: string;
};

// listingId ile real_estate_detail çek
export async function getVehicleDetail(listingId: number): Promise<VehicleDetailEntity | null> {
  const db = await openDb();

  const sql = `
    SELECT 
      vd.*,
      b.name AS brand_name,
      m.name AS model_name,
      s.name AS serial_name
    FROM vehicle_detail vd
    LEFT JOIN brand b ON b.id = vd.brand_id
    LEFT JOIN model m ON m.id = vd.model_id
    LEFT JOIN serial s ON s.id = vd.serial_id
    WHERE vd.listing_id = ?
  `;

  const rows = await db.getAllAsync<VehicleDetailEntity>(sql, [listingId]);
  console.log("VEHICLE_DETAIL JOIN:", rows);

  return rows && rows.length > 0 ? rows[0] : null;
}
