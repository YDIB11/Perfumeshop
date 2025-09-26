// app/tabs/orders.tsx

import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Image,
} from "react-native";
import { Text, Card, Avatar, useTheme } from "react-native-paper";
import { useShopContext } from "@/contexts/ShopContext";
import { Order } from "../types";
import CustomRating from "@/components/CustomRating";
const OrdersScreen: React.FC = () => {
  const { orders, userRatings, setUserRatings } = useShopContext();
  const { colors } = useTheme();

  const handleRating = (productId: string, rating: number) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
  };

  const renderOrderItem: ListRenderItem<Order> = ({ item }) => (
    <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
      <Card.Title
        title={`Order #${item.id}`}
        subtitle={`Date: ${new Date(item.date).toLocaleDateString()}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="clipboard-list"
            style={{ backgroundColor: colors.primary }}
          />
        )}
      />
      <Card.Content>
        {item.items.map((product) => (
          <View key={product.cartItemId} style={styles.productContainer}>
            <View style={styles.productInfo}>
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={{ color: colors.onSurface, fontWeight: "bold" }}>
                  {product.name}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant }}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
            </View>
            <CustomRating
              rating={userRatings[product.id] || 0}
              onRatingChange={(rating) => handleRating(product.id, rating)}
              isDisabled={false}
            />
          </View>
        ))}
        <Text
          style={{
            color: colors.onSurface,
            fontWeight: "bold",
            marginTop: 10,
            textAlign: "right",
          }}
        >
          Total: ${item.totalAmount.toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.onBackground, fontSize: 18 }}>
            You have no previous orders.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
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
  orderCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  productContainer: {
    marginVertical: 8,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
