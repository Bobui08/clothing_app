import { Product } from "@/types";

const BASE_URL = "https://dummyjson.com";

export const apiService = {
  async getProducts(
    skip = 0,
    limit = 40
  ): Promise<{ products: Product[]; total: number }> {
    const response = await fetch(
      `${BASE_URL}/products?skip=${skip}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },
};
