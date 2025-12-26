import { api } from "./gateway";
import { ListingWithData } from "../database/listing";
import { CategoryEntity } from "../database/category";

// ----------------------------------------------------------------------------
// 1. TİP TANIMLAMALARI (Backend'in beklediği JSON yapısı)
// ----------------------------------------------------------------------------

export type RealEstateDetailPayload = {
  room_number: string;
  bathroom_number: number;
  square_meter: number;
  floor: number;
  building_age: number;
  furnished: boolean;
  heat: string;
  kitchen: string;
  lift: boolean;
  car_park: boolean;
};

export type VehicleDetailPayload = {
  year: number;
  fuel: string;
  transmission: string;
  kilometer: number;
  body_type: string;
  engine_cc: string;
  instrumental: string;
  color: string;
};

export type FullListingPayload = {
  title: string;
  price: number;
  desc: string;
  category_id: number;
  province_id: number;
  district_id: number;
  user_id: number;
  feature_ids: number[];

  // Detaylar opsiyonel (?) çünkü sadece biri dolu olacak
  real_estate_detail?: RealEstateDetailPayload;
  vehicle_detail?: VehicleDetailPayload;
};

export type CreateListingResponse = {
  id: number;
  status: string;
};

// ----------------------------------------------------------------------------
// 2. MEVCUT FONKSİYONLARIN (Senin yazdıkların)
// ----------------------------------------------------------------------------

export const fetchListingByCategory = async (categoryId: number): Promise<ListingWithData[]> => {
  try {
    const res = await api.get<ListingWithData[]>("/listings", {
      params: { category_id: categoryId },
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching listings:", err.message);
    return [];
  }
};

export const fetchListingsByUser = async (userId: number): Promise<ListingWithData[]> => {
  try {
    const res = await api.get<ListingWithData[]>(`/listings/user/${userId}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching user listings:", err.message);
    return [];
  }
};

export const fetchFullListingDetails = async (listingId: number) => {
  const res = await api.get(`/listings/${listingId}/full-details`);
  return res.data; 
};

export const fetchCategoryOfListing = async (listingId: number): Promise<CategoryEntity|undefined> => {
  try {
    const res = await api.get<CategoryEntity>(`/listings/${listingId}/category`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching user listings:", err.message);
    return undefined;
  }
};

export const deleteListingApi = async (listingId: number) => {
  try {
    const res = await api.delete(`/listings/${listingId}`);
    return res.data; 
  } catch (err: any) {
    console.error("Error deleting listing:", err.message);
    throw err;
  }
};

// ----------------------------------------------------------------------------
// 3. YENİ EKLENENLER (Create & Upload)
// ----------------------------------------------------------------------------

// A) İlan Oluşturma (Tek Paket Halinde)
export const createFullListing = async (data: FullListingPayload): Promise<CreateListingResponse> => {
  try {
    const res = await api.post<CreateListingResponse>("/listings/", data);
    return res.data; // { id: 123, status: "success" }
  } catch (err: any) {
    // Hata detayını yakalamak için logluyoruz
    console.error("Error creating listing:", err.response?.data || err.message);
    throw err;
  }
};

export const uploadListingImages = async (
  listingId: number,
  imageUris: string[]
) => {
  try {
    const formData = new FormData();

    imageUris.forEach((uri, index) => {
      const filename = uri.split("/").pop() ?? `image_${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("images", {
        uri,
        name: filename,
        type,
      } as any);
    });

    const res = await api.post(
      `/listings/${listingId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("Error uploading images:", err?.response?.data || err.message);
    throw err;
  }
};