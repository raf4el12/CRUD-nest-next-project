import { apiClient } from "@/lib/api-client";
import { Category } from "@/lib/types";
import { CategoryFormValues } from "@/lib/validators/category";

export const categoriesService = {
  async createCategory(payload: CategoryFormValues): Promise<Category> {
    const response = await apiClient.post<Category>("/categories", payload);
    return response.data;
  },

  async updateCategory(id: number, payload: CategoryFormValues): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
    return response.data;
  },
};
