import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { Product } from "@/types";
import React, { memo } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = memo(({ product, onPress }: ProductCardProps) => {
  const { addProductToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    addProductToCart(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4"
      style={{ width: cardWidth }}
      activeOpacity={0.7}
    >
      <View className="relative">
        <Image
          source={{ uri: product.thumbnail }}
          className="w-full h-32 rounded-lg mb-2"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-1"
        >
          <Text
            className={`text-lg ${
              isFavorite(product.id) ? "text-red-500" : "text-gray-400"
            }`}
          >
            ♥
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        className="text-sm font-semibold text-gray-800 mb-1"
        numberOfLines={2}
      >
        {product.title}
      </Text>

      <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
        {product.category}
      </Text>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-yellow-500 mr-1">★</Text>
          <Text className="text-xs text-gray-600">
            {product.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleAddToCart}
        className={`py-2 px-3 rounded-lg ${
          isInCart(product.id) ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        <Text className="text-white text-xs font-semibold text-center">
          {isInCart(product.id) ? "In Cart" : "Add to Cart"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});
