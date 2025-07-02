import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CartItem } from "@/components/ui/CartItem";
import { PriceSummary } from "@/components/ui/PriceSummary";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "../../hooks/useCart";
import { TabsNavigator } from "@/components/ui/TabsNavigator";

export default function CartScreen() {
  const router = useRouter();
  const { cart, updateProductQuantity, removeProductFromCart, clearAllCart } =
    useCart();

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateProductQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeProductFromCart(id),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAllCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      "Checkout",
      `Proceed to checkout with ${
        cart.totalItems
      } items for ${cart.totalPrice.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Checkout",
          onPress: () => {
            // Here you would typically integrate with a payment system
            Alert.alert("Success", "Order placed successfully!", [
              {
                text: "OK",
                onPress: () => {
                  clearAllCart();
                  router.push("/");
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartItem
      item={item}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemoveItem}
    />
  );

  const renderEmptyCart = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-6xl mb-4">🛒</Text>
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Your cart is empty
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Add some products to your cart to see them here
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (cart.items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">
            Cart ({cart.items.length} items)
          </Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text className="text-red-500 font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <FlatList
          data={cart.items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Price Summary and Checkout */}
        <View>
          <PriceSummary
            totalItems={cart.totalItems}
            totalPrice={cart.totalPrice}
          />

          <View className="p-4 bg-white">
            <TouchableOpacity
              onPress={handleCheckout}
              className="bg-blue-500 rounded-lg p-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Fixed Tabs at Bottom */}
      <TabsNavigator />
    </View>
  );
}
