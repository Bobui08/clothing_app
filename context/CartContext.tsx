import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { loadCart, loadCartFromStorage } from "../store/slices/cartSlice";

interface CartProviderProps {
  children: React.ReactNode;
}

interface CartContextType {
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextType>({
  isCartLoaded: false,
});

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const storedCart = await loadCartFromStorage();
        dispatch(loadCart(storedCart));
        setIsCartLoaded(true);
      } catch (error) {
        console.warn("Failed to initialize cart:", error);
        setIsCartLoaded(true); // Still mark as loaded even if failed
      }
    };

    initializeCart();
  }, [dispatch]);

  const contextValue = useMemo(() => ({ isCartLoaded }), [isCartLoaded]);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};
