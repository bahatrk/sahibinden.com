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
