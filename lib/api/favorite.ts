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


export const addFavoriteApi = async (
  userId: number,
  listingId: number
) => {
  await api.post("/favorites", undefined, {
    params: { user_id: userId, listing_id: listingId },
  });
};


export const removeFavoriteApi = async (
  userId: number,
  listingId: number
) => {
  await api.delete("/favorites", {
    params: { user_id: userId, listing_id: listingId },
  });
};

export const isFavoriteApi = async (
  userId: number,
  listingId: number
): Promise<boolean> => {
  const res = await api.get("/favorites/is-favorite", {
    params: { user_id: userId, listing_id: listingId },
  });
  return res.data.favorite;
};