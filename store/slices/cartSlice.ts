import { CartItem, CartState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "shopping_cart";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper function to save cart to AsyncStorage
const saveCartToStorage = async (state: CartState) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save cart to storage:", error);
  }
};

// Helper function to load cart from AsyncStorage
export const loadCartFromStorage = async (): Promise<CartState> => {
  try {
    const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsedCart: CartState = JSON.parse(stored);
      return parsedCart;
    }
  } catch (error) {
    console.warn("Failed to load cart from storage:", error);
  }
  return initialState;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      saveCartToStorage(state);
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
});

export const {
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
