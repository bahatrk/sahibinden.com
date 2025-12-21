import { RealEstateWithImagesOut } from "../database/realEstateDetail";
import { api } from "./gateway";

export async function fetchRealEstate(listingId: number): Promise<RealEstateWithImagesOut | null> {
  try {
    const res = await api.get<RealEstateWithImagesOut>(`/real-estate/${listingId}`);
    return res.data;
  } catch (err) {
    console.error("fetchRealEstate error:", err);
    return null;
  }
}
