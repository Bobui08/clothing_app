import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../global.css";
import { store } from "../store";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <CartProvider>
          <FavoritesProvider>
            <Stack>
              <Stack.Screen
                name="onBoard"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="product/[id]"
                options={{
                  title: "Product Details",
                  headerStyle: { backgroundColor: "#3B82F6" },
                  headerTintColor: "#fff",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="cached-products/index"
                options={{
                  title: "Cached Products",
                  headerStyle: { backgroundColor: "#3B82F6" },
                  headerTintColor: "#fff",
                  headerShown: true,
                }}
              />
            </Stack>
          </FavoritesProvider>
        </CartProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
