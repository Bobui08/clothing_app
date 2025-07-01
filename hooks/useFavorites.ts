import { useCallback, useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const addToFavorites = useCallback((productId: number) => {
    setFavorites((prev) => [...prev, productId]);
  }, []);

  const removeFromFavorites = useCallback((productId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: number) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};
