import { api } from "./gateway";
import { ListingWithData } from "../database/listing";

export const fetchUserFavorites = async (userId: number): Promise<ListingWithData[]> => {
  try {
    const res = await api.get<ListingWithData[]>(`/favorites/${userId}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching user favorites:", err.message);
    return [];
  }
};
