import { Category, Product } from "@/types";

export const getUniqueCategories = (products: Product[]): Category[] => {
  const uniqueCategories = new Set<string>();
  products.forEach((product) => uniqueCategories.add(product.category));
  return Array.from(uniqueCategories).map((category) => ({
    slug: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    url: `https://dummyjson.com/products/category/${category}`,
  }));
};
