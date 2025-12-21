import { VehicleWithImagesOut } from "../database/vehicleDetail";
import { api } from "./gateway"; 

export async function fetchVehicle(listingId: number): Promise<VehicleWithImagesOut | null> {
  try {
    const res = await api.get<VehicleWithImagesOut>(`/vehicle/${listingId}`);
    return res.data; 
  } catch (err) {
    console.error("fetchVehicle error:", err);
    return null;
  }
}
