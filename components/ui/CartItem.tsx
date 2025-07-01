import { CartItem as CartItemType } from "@/types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 mx-4">
      <View className="flex-row">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-16 h-16 rounded-lg mr-3"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-800 mb-1"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text className="text-lg font-bold text-blue-600 mb-2">
            ${item.price.toFixed(2)}
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="text-gray-600 font-bold">-</Text>
              </TouchableOpacity>

              <Text className="mx-3 text-base font-semibold">
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="text-gray-600 font-bold">+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              className="bg-red-500 px-3 py-1 rounded-lg"
            >
              <Text className="text-white text-sm font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
