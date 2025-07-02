import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { apiService } from "../services/api";

interface CachedData {
  products: Product[];
  total: number;
  timestamp: number;
}

interface UseCachedProductsReturn {
  data: { products: Product[]; total: number } | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CACHE_KEY_PREFIX = "products_page_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useCachedProducts = (page: number): UseCachedProductsReturn => {
  const [data, setData] = useState<{
    products: Product[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCacheKey = (pageNum: number) => `${CACHE_KEY_PREFIX}${pageNum}`;

  const loadFromCache = useCallback(
    async (pageNum: number): Promise<CachedData | null> => {
      try {
        const cached = await AsyncStorage.getItem(getCacheKey(pageNum));
        if (cached) {
          const cachedData: CachedData = JSON.parse(cached);
          const now = Date.now();
          const isExpired = now - cachedData.timestamp > CACHE_DURATION;

          if (!isExpired) {
            return cachedData;
          }
        }
      } catch (err) {
        console.warn("Failed to load from cache:", err);
      }
      return null;
    },
    []
  );

  const saveToCache = useCallback(
    async (pageNum: number, products: Product[], total: number) => {
      try {
        const cacheData: CachedData = {
          products,
          total,
          timestamp: Date.now(),
        };
        await AsyncStorage.setItem(
          getCacheKey(pageNum),
          JSON.stringify(cacheData)
        );
      } catch (err) {
        console.warn("Failed to save to cache:", err);
      }
    },
    []
  );

  const fetchFromAPI = useCallback(
    async (
      pageNum: number
    ): Promise<{ products: Product[]; total: number }> => {
      const limit = 30;
      const skip = pageNum * limit;
      const response = await apiService.getProducts(skip, limit);
      return response;
    },
    []
  );

  const loadProducts = useCallback(
    async (pageNum: number, fromRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        // First, try to load from cache if not a manual refresh
        if (!fromRefresh) {
          const cachedData = await loadFromCache(pageNum);
          if (cachedData) {
            setData({ products: cachedData.products, total: cachedData.total });
            setLoading(false);

            // Fetch fresh data in background to update cache
            try {
              const freshData = await fetchFromAPI(pageNum);
              await saveToCache(pageNum, freshData.products, freshData.total);
              setData(freshData);
            } catch (backgroundError) {
              // Background fetch failed, but we have cached data
              console.warn("Background fetch failed:", backgroundError);
            }
            return;
          }
        }

        // No cache or manual refresh - fetch from API
        const freshData = await fetchFromAPI(pageNum);
        setData(freshData);
        await saveToCache(pageNum, freshData.products, freshData.total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        setError(errorMessage);

        // Try to fall back to cached data even if expired
        const cachedData = await loadFromCache(pageNum);
        if (cachedData) {
          setData({ products: cachedData.products, total: cachedData.total });
        }
      } finally {
        setLoading(false);
      }
    },
    [loadFromCache, saveToCache, fetchFromAPI]
  );

  const refresh = useCallback(async () => {
    await loadProducts(page, true);
  }, [page, loadProducts]);

  useEffect(() => {
    loadProducts(page);
  }, [page, loadProducts]);

  return {
    data,
    loading,
    error,
    refresh,
  };
};
