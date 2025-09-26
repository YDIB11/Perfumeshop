// app/screens/payment.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  CardField,
  useStripe,
  initStripe,
  CardFieldInput,
} from "@stripe/stripe-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { Text, Button } from "react-native-paper";
import { useShopContext } from "@/contexts/ShopContext";
import { Order } from "../types";

const PaymentScreen: React.FC = () => {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const { cart, setCart, orders, setOrders, appliedDiscount } =
    useShopContext(); // Access cart, orders, and appliedDiscount

  useEffect(() => {
    const publishableKey =
      "pk_test_51Q0j4rAkIZxzQMC6LmkwQYpjALIvPFjRN1az8ta8LGgNfVfO9IHeXiOTAWrn4oTUfvNP4Yzcpcep6DQrnV0gwd8d00Myx7WrRV";
    initStripe({ publishableKey });
  }, []);

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Error", "Please enter valid card details.");
      return;
    }

    const paymentAmount = Number(amount);
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      Alert.alert("Error", "Invalid amount.");
      return;
    }

    try {
      setPaymentLoading(true);
      const response = await fetch(
        "http://128.179.138.106:3000/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: paymentAmount * 100 }), // Amount in cents
        }
      );
      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Failed to retrieve client secret.");

      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: { billingDetails: { name: "Test User" } },
      });
      if (error) {
        Alert.alert("Payment failed", error.message);
      } else {
        // Payment successful, update orders and clear cart
        const newOrder: Order = {
          id: `${Date.now()}`,
          items: [...cart], // Clone the cart items
          totalAmount: paymentAmount,
          date: new Date(),
        };

        setOrders((prevOrders) => [...prevOrders, newOrder]);
        setCart([]); // Clear the cart

        Alert.alert("Payment successful!");
        router.replace("./success");
      }
    } catch (e: any) {
      Alert.alert("Payment failed", e.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>
        Total Amount: ${amount ? Number(amount).toFixed(2) : "0.00"}
      </Text>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: "4242 4242 4242 4242" }}
        cardStyle={{
          backgroundColor: colors.surface,
          textColor: colors.onSurface,
        }}
        style={styles.cardContainer}
        onCardChange={(details) => setCardDetails(details)}
      />
      <Button
        mode="contained"
        onPress={handlePayPress}
        style={styles.payButton}
        contentStyle={styles.buttonContent}
        labelStyle={[styles.buttonLabel, { color: colors.onPrimary }]}
        disabled={isPaymentLoading}
        loading={isPaymentLoading}
        accessibilityLabel="Pay Now"
        accessibilityHint="Processes the payment"
      >
        {isPaymentLoading ? "Processing..." : "Pay Now"}
      </Button>
      <Button
        mode="text"
        onPress={() => router.back()}
        labelStyle={[styles.buttonLabel, { color: colors.primary }]}
        accessibilityLabel="Go Back"
        accessibilityHint="Returns to the previous screen"
      >
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    height: 50,
    marginBottom: 20,
  },
  payButton: {
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
