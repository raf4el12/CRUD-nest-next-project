import { apiClient } from "@/lib/api-client";
import { Product } from "@/lib/types";
import { ProductFormValues } from "@/lib/validators/product";

export const productsService = {
  async createProduct(payload: ProductFormValues): Promise<Product> {
    const response = await apiClient.post<Product>("/products", payload);
    return response.data;
  },

  async updateProduct(id: number, payload: ProductFormValues): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  },
};
