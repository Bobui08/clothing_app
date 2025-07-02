import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FAVORITES_KEY = "user_favorites";

interface FavoritesContextType {
  favorites: Product[];
  loading: boolean;
  getFavorites: () => Product[];
  addFavorite: (item: Product) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
  toggleFavorite: (productId: number, productData?: Product) => Promise<void>;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsedFavorites: Product[] = JSON.parse(stored);
        setFavorites(parsedFavorites);
        setFavoriteIds(parsedFavorites.map((item) => item.id));
      }
    } catch (error) {
      console.warn("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites: Product[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.warn("Failed to save favorites:", error);
    }
  }, []);

  const getFavorites = useCallback(() => {
    return favorites;
  }, [favorites]);

  const addFavorite = useCallback(
    async (item: Product) => {
      // Check if already exists to prevent duplicates
      if (favoriteIds.includes(item.id)) {
        return;
      }

      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      setFavoriteIds(newFavorites.map((fav) => fav.id));
      await saveFavorites(newFavorites);
    },
    [favorites, favoriteIds, saveFavorites]
  );

  const removeFavorite = useCallback(
    async (id: number) => {
      const newFavorites = favorites.filter((item) => item.id !== id);
      setFavorites(newFavorites);
      setFavoriteIds(newFavorites.map((fav) => fav.id));
      await saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  const clearAllFavorites = useCallback(async () => {
    setFavorites([]);
    setFavoriteIds([]);
    await saveFavorites([]);
  }, [saveFavorites]);

  const toggleFavorite = useCallback(
    async (productId: number, productData?: Product) => {
      const isCurrentlyFavorite = favoriteIds.includes(productId);

      if (isCurrentlyFavorite) {
        await removeFavorite(productId);
      } else if (productData) {
        await addFavorite(productData);
      }
    },
    [favoriteIds, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (productId: number) => {
      return favoriteIds.includes(productId);
    },
    [favoriteIds]
  );

  const value: FavoritesContextType = useMemo(
    () => ({
      favorites,
      loading,
      getFavorites,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      toggleFavorite,
      isFavorite,
    }),
    [
      favorites,
      loading,
      getFavorites,
      addFavorite,
      removeFavorite,
      clearAllFavorites,
      toggleFavorite,
      isFavorite,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
