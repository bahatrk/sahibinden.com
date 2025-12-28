import { RealEstateWithImagesOut } from "../database/realEstateDetail";
import { api } from "./gateway";
import { CreateListingResponse, FullListingPayload } from "./listing";

// Tip tanımlaması (Backend'deki RealEstateDetailCreate ile uyumlu)
export type RealEstateDetailInput = {
  room_number: number | string; // Backend string bekliyor ama frontend number tutuyor olabilir, dönüşüm yapacağız
  bathroom_number: number;
  square_meter: number;
  floor: number;
  building_age: number;
  furnished: boolean;
  heat: string;
  kitchen: string;
  lift: number | boolean; // Local DB number (0/1) tutuyordu, API boolean istiyor
  car_park: number | boolean;
};


export async function fetchRealEstate(listingId: number): Promise<RealEstateWithImagesOut | null> {
  try {
    const res = await api.get<RealEstateWithImagesOut>(`/real-estate/${listingId}`);
    return res.data;
  } catch (err) {
    console.error("fetchRealEstate error:", err);
    return null;
  }
}


export const createRealEstateListing = async (
  data: FullListingPayload
): Promise<CreateListingResponse> => {
  const res = await api.post<CreateListingResponse>("/real-estate", data);
  return res.data;
};

export const updateRealEstateListing = async (
  listingId: number,
  data: FullListingPayload
): Promise<CreateListingResponse> => {
  // Corresponds to @router.put("/{listing_id}")
  const res = await api.put<CreateListingResponse>(`/real-estate/${listingId}`, data);
  return res.data;
};


export { RealEstateWithImagesOut };
