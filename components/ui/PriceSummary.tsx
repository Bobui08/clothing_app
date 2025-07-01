import React from "react";
import { Text, View } from "react-native";

interface PriceSummaryProps {
  totalItems: number;
  totalPrice: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  totalItems,
  totalPrice,
}) => {
  return (
    <View className="bg-white border-t border-gray-200 p-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base text-gray-600">Total Items:</Text>
        <Text className="text-base font-semibold">{totalItems}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-800">Total Price:</Text>
        <Text className="text-xl font-bold text-blue-600">
          ${totalPrice.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
