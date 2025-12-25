import { api } from "./gateway";

export type Province = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
};

export type Neigborhood = {
  id: number;
  name: string;
  area_name: string;
  postal_code: string;
};


export type LocationOut = {
  city_name: string;
  district_name: string;
  neighbourhood_name: string;
  lat?: string;
  lon?: string;
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

export const fetchDistrictsByProvinceId = async (province_id: number): Promise<District[]> => {
      
  try {
    const res = await api.get<District[]>(`/locations/districts/${province_id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching Districts with province id:" + province_id, err.message);
    return [];
  }
};


export const fetchNeigborhoodByDistricts = async (district_id: number): Promise<Neigborhood[]> => {
      
  try {
    const res = await api.get<Neigborhood[]>(`/locations/neighbourhoods/${district_id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching fetchNeigborhoodByDistricts:"+ district_id, err.message);
    return [];
  }
};
