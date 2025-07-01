import { Product } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";
import { apiService } from "../../services/api";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addProductToCart, isInCart, getCartItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await apiService.getProductById(Number(id));
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addProductToCart(product);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product.id);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">
          {error ?? "Product not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {product.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === selectedImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
          >
            <Text
              className={`text-xl ${
                isFavorite(product.id) ? "text-red-500" : "text-gray-400"
              }`}
            >
              ♥
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {product.title}
              </Text>
              <Text className="text-base text-gray-600 capitalize">
                {product.category} • {product.brand}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-3xl font-bold text-blue-600 mb-1">
                ${product.price.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <Text className="text-sm text-green-600 font-medium">
                  {product.discountPercentage.toFixed(0)}% OFF
                </Text>
              )}
            </View>
          </View>

          {/* Rating and Stock */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Text className="text-yellow-500 text-lg mr-1">★</Text>
              <Text className="text-base font-medium text-gray-700">
                {product.rating.toFixed(1)} Rating
              </Text>
            </View>

            <View className="flex-row items-center">
              <View
                className={`w-3 h-3 rounded-full mr-2 ${
                  product.stock > 10
                    ? "bg-green-500"
                    : product.stock > 0
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              <Text className="text-base text-gray-700">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Description
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              {product.description}
            </Text>
          </View>

          {/* Product Details */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Product Details
            </Text>

            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">SKU</Text>
                <Text className="font-medium">{product.sku}</Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">Weight</Text>
                <Text className="font-medium">{product.weight} kg</Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-gray-600">Warranty</Text>
                <Text className="font-medium">
                  {product.warrantyInformation}
                </Text>
              </View>

              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="font-medium">
                  {product.shippingInformation}
                </Text>
              </View>
            </View>
          </View>

          {/* Reviews Summary */}
          {product.reviews.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Recent Reviews ({product.reviews.length})
              </Text>

              {product.reviews.slice(0, 3).map((review, index) => (
                <View key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium text-gray-800">
                      {review.reviewerName}
                    </Text>
                    <View className="flex-row">
                      {[...Array(5)].map((_, i) => (
                        <Text
                          key={i}
                          className={`text-sm ${
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-white border-t border-gray-200 p-4 flex-row">
        {isInCart(product.id) ? (
          <View className="flex-1 bg-green-100 rounded-lg p-4 flex-row justify-between items-center">
            <Text className="text-green-800 font-semibold">
              In Cart ({getCartItemQuantity(product.id)})
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="bg-green-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">View Cart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 rounded-lg p-4 ${
              product.stock === 0 ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
