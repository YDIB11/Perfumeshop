// app/screens/success.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";

const SuccessScreen: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Success Icon */}
      <Avatar.Icon
        size={100}
        icon="check-circle"
        color={colors.onPrimary}
        style={[styles.icon, { backgroundColor: colors.primary }]}
      />

      {/* Success Message */}
      <Text style={[styles.title, { color: colors.onBackground }]}>
        Payment Successful!
      </Text>

      {/* Subtext */}
      <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
        Thank you for your purchase. Your order is being processed.
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push("../(tabs)/shop")}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          Continue Shopping
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push("../(tabs)/orders")}
          style={[
            styles.button,
            { borderColor: colors.primary, marginTop: 10 },
          ]}
          labelStyle={[styles.buttonLabel, { color: colors.primary }]}
        >
          View Orders
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContent: {
    paddingVertical: 10,
  },
});

export default SuccessScreen;
