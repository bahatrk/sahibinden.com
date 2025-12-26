import { VehicleWithImagesOut } from "../database/vehicleDetail";
import { api } from "./gateway"; 
import { CreateListingResponse, FullListingPayload } from "./listing";


// POST Body için tip (Backend schema ile uyumlu)
export type VehicleDetailInput = {
  year: number;
  fuel: string;
  transmission: string;
  kilometer: number;
  body_type: string;
  engine_cc: string;
  instrumental: string;
  color: string;
};



export async function fetchVehicle(listingId: number): Promise<VehicleWithImagesOut | null> {
  try {
    const res = await api.get<VehicleWithImagesOut>(`/vehicle/${listingId}`);
    return res.data; 
  } catch (err) {
    console.error("fetchVehicle error:", err);
    return null;
  }
}


export const createVehicleListing = async (
  data: FullListingPayload
): Promise<CreateListingResponse> => {
  const res = await api.post<CreateListingResponse>("/vehicle", data);
  return res.data;
};


export const updateVehicleListing = async (
  listingId: number,
  data: FullListingPayload
): Promise<CreateListingResponse> => {
  // Corresponds to @router.put("/{listing_id}")
  const res = await api.put<CreateListingResponse>(`/vehicle/${listingId}`, data);
  return res.data;
};

export { VehicleWithImagesOut };
