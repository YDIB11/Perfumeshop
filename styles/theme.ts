// styles/themes.ts

import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1E88E5",
    onPrimary: "#FFFFFF",
    background: "#FFFFFF",
    onBackground: "#212121",
    surface: "#FAFAFA",
    onSurface: "#212121",
    error: "#D32F2F",
    onError: "#FFFFFF",
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#90CAF9",
    onPrimary: "#000000",
    background: "#121212",
    onBackground: "#E0E0E0",
    surface: "#1D1D1D",
    onSurface: "#E0E0E0",
    error: "#EF9A9A",
    onError: "#000000",
  },
};
