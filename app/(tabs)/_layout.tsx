import { Drawer } from "expo-router/drawer";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Custom Drawer Content
function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header Section */}
      <View
        style={{
          backgroundColor: "#3B82F6",
          padding: 20,
          marginTop: -5,
          marginHorizontal: -5,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
              borderWidth: 3,
              borderColor: "white",
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            John Doe
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
            }}
          >
            john.doe@example.com
          </Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItem
          label="Home"
          onPress={() => router.push("/(tabs)")}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500" }}
          activeTintColor="#3B82F6"
        />

        <DrawerItem
          label="Wishlist"
          onPress={() => router.push("/(tabs)/wishlist")}
          icon={({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500" }}
          activeTintColor="#3B82F6"
        />

        <DrawerItem
          label="Cart"
          onPress={() => router.push("/(tabs)/cart")}
          icon={({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500" }}
          activeTintColor="#3B82F6"
        />

        <View
          style={{
            height: 1,
            backgroundColor: "#E5E7EB",
            marginVertical: 10,
            marginHorizontal: 15,
          }}
        />

        <DrawerItem
          label="Settings"
          onPress={() => {}}
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500" }}
          activeTintColor="#3B82F6"
        />

        <DrawerItem
          label="Help & Support"
          onPress={() => {}}
          icon={({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500" }}
          activeTintColor="#3B82F6"
        />
      </View>

      {/* Footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingTop: 15,
          paddingBottom: 20,
        }}
      >
        <DrawerItem
          label="Logout"
          onPress={() => {}}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color="#EF4444" />
          )}
          labelStyle={{ fontSize: 16, fontWeight: "500", color: "#EF4444" }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Custom Header Component
function CustomHeader({ navigation, title }) {
  return (
    <View className="bg-white p-3 pt-8 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          className="bg-black rounded-full w-10 h-10 flex items-center justify-center mr-3.5"
        >
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../../assets/images/logo.png")}
        className="w-24 h-24"
      />

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
        }}
        className="w-11 h-11 rounded-full border-2 border-gray-200"
      />
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "white",
          width: 280,
        },
        drawerActiveTintColor: "#3B82F6",
        drawerInactiveTintColor: "#6B7280",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={({ navigation }) => ({
          drawerLabel: "Home",
          title: "Products",
          header: () => (
            <CustomHeader navigation={navigation} title="Products" />
          ),
        })}
      />

      <Drawer.Screen
        name="wishlist"
        options={{
          drawerLabel: "Wishlist",
          title: "Wishlist",
          headerShown: true, // Ẩn header, bạn sẽ tự làm sau
        }}
      />

      <Drawer.Screen
        name="cart"
        options={{
          drawerLabel: "Cart",
          title: "Shopping Cart",
          headerShown: true, // Ẩn header, bạn sẽ tự làm sau
        }}
      />
    </Drawer>
  );
}
