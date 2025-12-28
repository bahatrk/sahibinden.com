import { api } from "./gateway";


export const fetchAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const deleteUserAsAdmin = async (userId: number) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};

export const fetchAllListingsAdmin = async () => {
  const res = await api.get("/admin/listings");
  return res.data;
};

export interface CategoryStat {
    id: number;
    name: string;
    total_listings: number;
    average_price: number;
}

export async function fetchCategoryStats() {
    const res = await api.get<CategoryStat[]>("/admin/reports/categories");
    return res.data;
}