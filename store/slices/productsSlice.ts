import { ProductsState } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  searchQuery: "",
  selectedCategory: "",
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    total: 0,
    limit: 30,
    hasMore: true,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    skip = 0,
    limit = 30,
    reset = false,
  }: {
    skip?: number;
    limit?: number;
    reset?: boolean;
  }) => {
    const data = await apiService.getProducts(skip, limit);
    return { ...data, reset };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFilters(state);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { products, total, reset } = action.payload;

        if (reset) {
          state.products = products;
          state.pagination.currentPage = 0;
        } else {
          state.products = [...state.products, ...products];
          state.pagination.currentPage += 1;
        }

        state.pagination.total = total;
        state.pagination.hasMore =
          state.products.length < total && state.products.length < 40;
        applyFilters(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch products";
      });
  },
});

function applyFilters(state: ProductsState) {
  let filtered = state.products;

  if (state.selectedCategory) {
    filtered = filtered.filter(
      (product) => product.category === state.selectedCategory
    );
  }

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }

  state.filteredProducts = filtered;
}

export const { setSearchQuery, setSelectedCategory } = productsSlice.actions;
export default productsSlice.reducer;
