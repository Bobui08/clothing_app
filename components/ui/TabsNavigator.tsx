import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const tabs: TabItem[] = [
  {
    name: "index",
    label: "Products",
    icon: "storefront-outline",
    route: "/(tabs)",
  },
  {
    name: "wishlist",
    label: "Wishlist",
    icon: "heart-outline",
    route: "/(tabs)/wishlist",
  },
  {
    name: "cart",
    label: "Cart",
    icon: "cart-outline",
    route: "/(tabs)/cart",
  },
];

export function TabsNavigator() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/(tabs)" && pathname === "/(tabs)") return true;
    if (route !== "/(tabs)" && pathname.includes(route.split("/").pop() || ""))
      return true;
    return false;
  };

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => handleTabPress(tab.route)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={
                  active ? (tab.icon.replace("-outline", "") as any) : tab.icon
                }
                size={24}
                color={active ? "#3B82F6" : "#6B7280"}
              />
            </View>
            <Text
              style={[styles.label, { color: active ? "#3B82F6" : "#6B7280" }]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  activeTab: {
    // Có thể thêm style cho tab active nếu cần
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
// This component can be used in your main layout file to render the tabs navigator     