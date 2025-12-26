import { api } from "../api/gateway";
import { CategoryEntity } from "../database/category";

const getEndpoint = (isAdmin: boolean) => isAdmin ? "/admin/categories" : "/categories";

export const fetchRootCategories = async (isAdmin: boolean = false): Promise<CategoryEntity[]> => {
  const endpoint = getEndpoint(isAdmin);
  try {
    // Assuming backend returns roots when no params provided, or you can add ?root=true
    const res = await api.get<CategoryEntity[]>(endpoint);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching root categories:", err);
    return [];
  }
};

export const fetchCategoriesByParent = async (parentId: number, isAdmin: boolean = false): Promise<CategoryEntity[]> => {
  if (parentId === -1) {
    return fetchRootCategories(isAdmin);
  }

  const endpoint = getEndpoint(isAdmin);
  try {
    const res = await api.get<CategoryEntity[]>(endpoint, {
      params: { parent_id: parentId }, 
    });
    return res.data;
  } catch (err: any) {
    console.error(`Error fetching children for ${parentId}:`, err.message);
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


export async function deleteCategory(id: number) {
  try {
    // Calls the DELETE endpoint (Deactivates)
    await api.delete(`/categories/${id}`);
    return { success: true };
  } catch (err: any) {
    console.error("Delete failed", err);
    return { success: false, message: "Pasife alınamadı" };
  }
}

export async function restoreCategory(id: number) {
  try {
    // Calls the RESTORE endpoint (Activates)
    await api.post(`/categories/${id}/restore`);
    return { success: true };
  } catch (err: any) {
    console.error("Restore failed", err);
    return { success: false, message: "Aktife alınamadı" };
  }
}