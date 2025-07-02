import { TabsNavigator } from "@/components/ui/TabsNavigator";
import { useFavorites } from "@/hooks/useFavorites";
import { Product } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WishlistScreen() {
  const router = useRouter();
  const { favorites, loading, removeFavorite, clearAllFavorites } =
    useFavorites();

  const handleRemoveFromWishlist = (id: number, title: string) => {
    Alert.alert(
      "Remove from Wishlist",
      `Remove "${title}" from your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFavorite(id),
        },
      ]
    );
  };

  const handleClearAllFavorites = () => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAllFavorites },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 mx-4"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-20 h-20 rounded-lg mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-800 mb-2"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text className="text-sm text-gray-500 mb-2" numberOfLines={1}>
            {item.category}
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-blue-600">
              ${item.price.toFixed(2)}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-sm text-gray-600">
                {item.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveFromWishlist(item.id, item.title)}
            className="bg-red-500 px-3 py-2 rounded-lg self-start"
          >
            <Text className="text-white text-sm font-semibold">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyWishlist = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-6xl mb-4">💝</Text>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Your wishlist is empty
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Add products to your wishlist by tapping the heart icon
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-2">Loading your wishlist...</Text>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {renderEmptyWishlist()}
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}

        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">
            Wishlist ({favorites.length} items)
          </Text>
          <TouchableOpacity onPress={handleClearAllFavorites}>
            <Text className="text-red-500 font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Favorites List */}
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Fixed Tabs at Bottom */}
      <TabsNavigator />
    </View>
  );
}
