import { useCachedProducts } from "@/hooks/useCachedProducts";
import { Product } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductCard } from "../../components/ui/ProductCard";

export default function CachedProductsScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const { data, loading, error, refresh } = useCachedProducts(currentPage);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleNextPage = () => {
    if (data && data.products.length < data.total) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  if (error && !data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">Error: {error}</Text>
        <TouchableOpacity
          onPress={refresh}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">
          Cached Products (Page {currentPage + 1})
        </Text>
        {data && (
          <Text className="text-sm text-gray-600">
            Showing {data.products.length} of {data.total} products
          </Text>
        )}
        {error && (
          <Text className="text-sm text-red-500 mt-1">
            Error: {error} (showing cached data)
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && !data && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-2">Loading products...</Text>
        </View>
      )}

      {/* Products List */}
      {data && (
        <>
          <FlatList
            data={data.products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Pagination Controls */}
          <View className="flex-row justify-between items-center p-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 0 ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <Text
                className={`font-semibold ${
                  currentPage === 0 ? "text-gray-500" : "text-white"
                }`}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <Text className="text-gray-600">Page {currentPage + 1}</Text>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={!data || data.products.length >= data.total}
              className={`px-4 py-2 rounded-lg ${
                !data || data.products.length >= data.total
                  ? "bg-gray-300"
                  : "bg-blue-500"
              }`}
            >
              <Text
                className={`font-semibold ${
                  !data || data.products.length >= data.total
                    ? "text-gray-500"
                    : "text-white"
                }`}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Loading overlay for background updates */}
      {loading && data && (
        <View className="absolute top-20 left-0 right-0 items-center">
          <View className="bg-black/70 rounded-lg p-2 flex-row items-center">
            <ActivityIndicator size="small" color="#ffffff" />
            <Text className="text-white ml-2 text-sm">Updating...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
