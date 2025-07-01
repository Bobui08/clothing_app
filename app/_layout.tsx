import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../global.css";
import { store } from "../store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Products",
            headerStyle: { backgroundColor: "#3B82F6" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Product Details",
            headerStyle: { backgroundColor: "#3B82F6" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="cart/index"
          options={{
            title: "Shopping Cart",
            headerStyle: { backgroundColor: "#3B82F6" },
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </Provider>
  );
}
