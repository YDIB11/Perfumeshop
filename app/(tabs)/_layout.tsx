// app/(tabs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "@/styles/theme";

export default function TabLayout() {
  return <ThemedTabScreens />;
}

const ThemedTabScreens = () => {
  const { theme } = useThemeContext();
  const paperTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <Tabs
        screenOptions={({ route }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "alert";

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "shop") {
            iconName = "cart";
          } else if (route.name === "cart") {
            iconName = "basket";
          } else if (route.name === "orders") {
            iconName = "clipboard";
          } else if (route.name === "wishlist") {
            iconName = "heart";
          }

          return {
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={iconName} size={size} color={color} />
            ),
            tabBarActiveTintColor: paperTheme.colors.primary,
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: paperTheme.colors.background,
              borderTopWidth: 0,
              elevation: 0,
            },
            headerStyle: {
              backgroundColor: paperTheme.colors.background,
              shadowColor: "transparent",
              elevation: 0,
            },
            headerTintColor: paperTheme.colors.onBackground,
          };
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="shop" options={{ title: "Shop" }} />
        <Tabs.Screen name="cart" options={{ title: "Cart" }} />
        <Tabs.Screen name="orders" options={{ title: "Orders" }} />
        <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      </Tabs>
    </PaperProvider>
  );
};
