import React from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search products...",
}) => {
  return (
    <View className="mx-4 mb-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};
