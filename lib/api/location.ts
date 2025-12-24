import { api } from "./gateway";

export type Province = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
};


export const fetchAllProvinces = async (): Promise<Province[]> => {
  try {
    const res = await api.get<Province[]>(`/locations/cities`);
    return res.data;
  } catch (err: any) {
    console.error(err +' API');
    return [];
  }
};

export const fetchProvinceIdDistricts = async (province_id: number): Promise<District[]> => {
      
  try {
    const res = await api.get<District[]>(`/locations/districts/province/${province_id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching categories:", err.message);
    return [];
  }
};


export const fetchNeigborhoodByDistricts = async (district_id: number): Promise<District[]> => {
      
  try {
    const res = await api.get<District[]>(`/locations/neighbourhoods/${district_id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching categories:", err.message);
    return [];
  }
};
