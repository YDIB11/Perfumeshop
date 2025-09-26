// app/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { Provider as PaperProvider } from "react-native-paper";
import { useThemeContext } from "@/contexts/ThemeContext";
import { lightTheme, darkTheme } from "@/styles/theme";

export default function RootLayout() {
  return (
    <ShopProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </ShopProvider>
  );
}

const ThemedApp = () => {
  const { theme } = useThemeContext();
  const paperTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/payment" options={{ headerShown: false }} />
        <Stack.Screen name="screens/success" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
};
