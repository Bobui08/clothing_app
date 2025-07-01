import { getUniqueCategories } from "@/utils/getUniqueCategories";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
} from "../store/slices/productsSlice";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productsState = useSelector((state: RootState) => state.products);
  const categories = getUniqueCategories(productsState.products);

  const loadProducts = (reset = false) => {
    const skip = reset ? 0 : productsState.products.length;
    const limit = reset ? 30 : 10;
    dispatch(fetchProducts({ skip, limit, reset }));
  };

  const updateSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const searchProductsByTitle = (query: string) => {
    updateSearchQuery(query);
  };

  const filterByCategory = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  useEffect(() => {
    loadProducts(true);
  }, []);

  return {
    ...productsState,
    categories,
    loadProducts,
    searchProductsByTitle,
    filterByCategory,
  };
};
