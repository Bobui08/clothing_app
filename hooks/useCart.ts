import { Product } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../store/slices/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  const addProductToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      })
    );
  };

  const removeProductFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  };

  const clearAllCart = () => {
    dispatch(clearCart());
  };

  const isInCart = (productId: number) => {
    return cart.items.some((item) => item.id === productId);
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cart.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    cart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearAllCart,
    isInCart,
    getCartItemQuantity,
  };
};
