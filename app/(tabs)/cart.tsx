// app/tabs/cart.tsx

import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItem,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTheme } from "react-native-paper";
import { CartItem } from "../types";
import { Text, Button, Card, IconButton, TextInput } from "react-native-paper";
import { useShopContext } from "@/contexts/ShopContext";

const CartScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const { colors } = useTheme();
  const router = useRouter();
  const { cart, setCart, appliedDiscount, applyDiscount } = useShopContext();

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");

  const handleApplyDiscount = () => {
    const success = applyDiscount(discountCode);
    if (success) {
      setDiscountError("");
    } else {
      setDiscountError("Invalid discount code.");
    }
  };

  const handleProceedToPayment = () => {
    router.push({
      pathname: "../screens/payment",
      params: { amount: finalAmount.toFixed(2) },
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const discountedAmount = appliedDiscount
    ? appliedDiscount.type === "percentage"
      ? totalAmount * (1 - appliedDiscount.value / 100)
      : totalAmount - appliedDiscount.value
    : totalAmount;

  const shippingCost = discountedAmount >= 200 ? 0 : 5;

  const finalAmount = discountedAmount + shippingCost;

  // Memoized component for rendering each cart item
  const CartItemComponent: React.FC<{ item: CartItem }> = React.memo(
    ({ item }) => (
      <Card style={styles.card}>
        <View style={styles.cardInner}>
          <View style={styles.cardContent}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text
                variant="titleMedium"
                style={{ color: colors.onSurface, fontWeight: "bold" }}
              >
                {item.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurface, marginTop: 4 }}
              >
                ${item.price.toFixed(2)}
              </Text>
            </View>
            <IconButton
              icon="delete"
              size={24}
              onPress={() => {
                if (item.cartItemId) {
                  handleRemoveItem(item.cartItemId); // Only call if cartItemId exists
                }
              }}
              style={styles.deleteButton}
              iconColor={colors.error}
            />
          </View>
        </View>
      </Card>
    )
  );

  // Render item function
  const renderItem: ListRenderItem<CartItem> = ({ item }) => (
    <CartItemComponent item={item} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={[styles.emptyCartText, { color: colors.onBackground }]}>
            Your cart is empty.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push("./shop")}
            style={styles.shopButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Shop Now
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.cartItemId!} // Use the unique cartItemId as the key
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          {/* Discount Code Input */}
          <View style={styles.discountContainer}>
            <TextInput
              label="Discount Code"
              value={discountCode}
              onChangeText={setDiscountCode}
              style={styles.discountInput}
              error={!!discountError}
            />
            <Button
              onPress={handleApplyDiscount}
              mode="contained"
              style={styles.applyButton}
            >
              Apply
            </Button>
          </View>
          {discountError ? (
            <Text style={{ color: colors.error, marginLeft: 16 }}>
              {discountError}
            </Text>
          ) : null}
          {appliedDiscount ? (
            <Text style={{ color: colors.primary, marginLeft: 16 }}>
              Discount "{appliedDiscount.code}" applied.
            </Text>
          ) : null}

          <View
            style={[
              styles.totalContainer,
              { borderColor: colors.onSurfaceVariant },
            ]}
          >
            <Text style={[styles.totalText, { color: colors.onBackground }]}>
              Subtotal: ${totalAmount.toFixed(2)}
            </Text>
            {appliedDiscount && (
              <Text style={[styles.totalText, { color: colors.onBackground }]}>
                Discount: -${(totalAmount - discountedAmount).toFixed(2)}
              </Text>
            )}
            <Text style={[styles.totalText, { color: colors.onBackground }]}>
              Shipping: ${shippingCost.toFixed(2)}
            </Text>
            <Text style={[styles.totalText, { color: colors.onBackground }]}>
              Total: ${finalAmount.toFixed(2)}
            </Text>
            <Button
              mode="contained"
              onPress={handleProceedToPayment}
              style={styles.payButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Proceed to Payment
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardInner: {
    borderRadius: 8,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  deleteButton: {
    marginRight: 8,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
  },
  discountInput: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    alignSelf: "center",
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "right",
  },
  payButton: {
    borderRadius: 8,
    marginTop: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyCartText: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  shopButton: {
    borderRadius: 8,
  },
});

export default CartScreen;
