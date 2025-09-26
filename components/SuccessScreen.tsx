// app/success.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import colors from "@/constants/Colors";

const SuccessScreen: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <Text style={[styles.title, { color: colors[theme].text }]}>
        Payment Successful!
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push("./shop")}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Continue Shopping
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SuccessScreen;
