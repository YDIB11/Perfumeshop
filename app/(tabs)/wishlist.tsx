// app/(tabs)/wishlist.tsx

import React from "react";
import { View, FlatList, StyleSheet, Image, Alert } from "react-native";
import { useTheme } from "react-native-paper";
import { Text, Card, Button } from "react-native-paper";
import { useShopContext } from "@/contexts/ShopContext";
import { useRouter } from "expo-router";
import { CartItem } from "../types";

const WishlistScreen: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { wishlist, setWishlist, setCart } = useShopContext();

  const moveToCart = (item: CartItem) => {
    // Add item to cart
    setCart((prevCart) => [
      ...prevCart,
      { ...item, cartItemId: `${item.id}-${Date.now()}` },
    ]);
    // Remove item from wishlist
    setWishlist((prevWishlist) =>
      prevWishlist.filter((wishlistItem) => wishlistItem.id !== item.id)
    );
    Alert.alert("Moved to Cart", `${item.name} has been moved to your cart.`);
  };

  const renderWishlistItem = ({ item }: { item: CartItem }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={{ color: colors.onSurface, fontWeight: "bold" }}>
            {item.name}
          </Text>
          <Text style={{ color: colors.onSurface }}>
            ${item.price.toFixed(2)}
          </Text>
          <Button
            mode="contained"
            onPress={() => moveToCart(item)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Add to Cart
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.onBackground }}>
            Your wishlist is empty.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderWishlistItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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
  button: {
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WishlistScreen;
