import { Category } from "@/types";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <TouchableOpacity
          onPress={() => onSelectCategory("")}
          className={`mr-3 px-4 py-2 rounded-full border ${
            selectedCategory === ""
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-gray-300"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedCategory === "" ? "text-white" : "text-gray-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectCategory(category.slug)}
            className={`mr-3 px-4 py-2 rounded-full border ${
              selectedCategory === category.slug
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === category.slug
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
