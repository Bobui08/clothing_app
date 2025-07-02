import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { Product } from "@/types";
import { useProducts } from "../../hooks/useProducts";
import { TabsNavigator } from "@/components/ui/TabsNavigator";

export default function ProductListScreen() {
  const router = useRouter();
  const {
    filteredProducts,
    categories,
    loading,
    error,
    pagination,
    searchQuery,
    selectedCategory,
    loadProducts,
    searchProductsByTitle,
    filterByCategory,
  } = useProducts();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    loadProducts(true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore && !searchQuery && !selectedCategory) {
      loadProducts(false);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-8">
      <Text className="text-gray-500 text-base">No products found</Text>
    </View>
  );

  // Loại bỏ trùng lặp
  const uniqueProducts = filteredProducts.filter(
    (product, index, self) =>
      index === self.findIndex((t) => t.id === product.id)
  );

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">Error: {error}</Text>
          <TouchableOpacity
            onPress={() => loadProducts(true)}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
        <TabsNavigator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="mx-4 my-4">
          <Text className="text-black text-3xl font-extrabold">Welcome,</Text>
          <Text className="text-[#666666] text-lg font-semibold">
            Our Fashions App
          </Text>
        </View>

        <SearchBar value={searchQuery} onChangeText={searchProductsByTitle} />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={filterByCategory}
        />

        <FlatList
          data={uniqueProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3B82F6"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Fixed Tabs at Bottom */}
      <TabsNavigator />
    </View>
  );
}
