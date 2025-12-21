import { api } from "./gateway";
import { ListingWithData } from "../database/listing";


export const fetchListingByCategory = async (categoryId: number): Promise<ListingWithData[]> => {
    
  try {
    const res = await api.get<ListingWithData[]>("/listings", {
      params: { category_id: categoryId }, // <-- query parameter
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching listings:", err.message);
    return [];
  }
};

// Kullanıcı ilanları
export const fetchListingsByUser = async (userId: number): Promise<ListingWithData[]> => {
  try {
    const res = await api.get<ListingWithData[]>(`/listings/user/${userId}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching user listings:", err.message);
    return [];
  }
};

//Ilan kaldırma
export const deleteListingApi = async (listingId: number) => {
  try {
    const res = await api.delete(`/listings/${listingId}`);
    return res.data; // { success: boolean, message: string } dönüyor
  } catch (err: any) {
    console.error("Error deleting listing:", err.message);
    throw err;
  }
};
