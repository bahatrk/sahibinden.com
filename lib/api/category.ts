import { api } from "../api/gateway";
import { CategoryEntity } from "../database/category";

export const fetchRootCategories = async (): Promise<CategoryEntity[]> => {
  try {
    const res = await api.get<CategoryEntity[]>(`/categories`);
    return res.data;
  } catch (err: any) {
    console.error(err +' API');
    return [];
  }
};

export const fetchCategoriesByParent = async (parentId: number): Promise<CategoryEntity[]> => {
    
  if (parentId == -1)
    return fetchRootCategories();
  
  try {
    const res = await api.get<CategoryEntity[]>("/categories", {
      params: { parent_id: parentId }, // <-- query parameter
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching categories:", err.message);
    return [];
  }
};
