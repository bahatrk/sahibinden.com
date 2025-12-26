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
    console.error("Error fetching categories:" + parentId, err.message);
    return [];
  }
};


// Helper to fetch types for the dropdown
export async function fetchCategoryTypes() {
    const res = await api.get("/category-types/");
    return res.data; 
}

export async function createCategory(
    name: string, 
    parentId: number | null, 
    typeId: number | null,      // Existing Type ID
    newTypeName: string | null, // New Type Name (if creating new)
    imageUri?: string 
) {
  try {
    const formData = new FormData();

    formData.append("name", name);
    if (parentId) formData.append("parent_id", parentId.toString());
    
    // LOGIC: Send ID or Name
    if (newTypeName) {
        formData.append("new_category_type_name", newTypeName);
    } else if (typeId) {
        formData.append("category_type_id", typeId.toString());
    }

    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      // @ts-ignore
      formData.append("file", { uri: imageUri, name: filename, type });
    }

    const res = await api.post("/categories/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Kategori oluşturulamadı" };
  }
}
