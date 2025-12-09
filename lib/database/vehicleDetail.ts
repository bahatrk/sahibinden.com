import { openDb } from "./db";

export type VehicleDetailEntity = {
  listing_id: number;
  brand_id: number;
  model_id: number;
  serial_id: number;
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
    SELECT *
    FROM vehicle_detail
    WHERE listing_id = ?
  `;

  const rows = await db.getAllAsync<VehicleDetailEntity>(sql, [listingId]);

  return rows && rows.length > 0 ? rows[0] : null;
}
