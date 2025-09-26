// app/tabs/shop.tsx

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ListRenderItem,
  Animated,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useTheme,
  ActivityIndicator,
  Badge,
  Searchbar,
  Card,
  Text,
  FAB,
  Button,
  Checkbox,
} from "react-native-paper";
import { CartItem } from "../types";
import { useShopContext } from "@/contexts/ShopContext";
import ReanimatedButton from "../animations/ReanimatedButton";
import CustomRating from "@/components/CustomRating";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import debounce from "lodash.debounce";

const productRatings: Record<string, { rating: number; userCount: number }> = {
  "1": { rating: 4.5, userCount: 32 },
  "2": { rating: 4.3, userCount: 28 },
  "3": { rating: 4.7, userCount: 50 },
  "4": { rating: 4.6, userCount: 42 },
  "5": { rating: 4.8, userCount: 36 },
};

const ShopScreen: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  const { products, cart, setCart, wishlist, setWishlist, userRatings } =
    useShopContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] =
    useState<CartItem[]>(products);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  const cartAnimation = useRef(new Animated.Value(1)).current;

  const animateCart = useCallback(() => {
    Animated.sequence([
      Animated.timing(cartAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cartAnimation]);

  const addToCart = useCallback(
    (product: CartItem) => {
      const cartItem = {
        ...product,
        cartItemId: `${product.id}-${Date.now()}`,
      };

      setCart((prevCart) => [...prevCart, cartItem]);

      animateCart();
    },
    [setCart, animateCart]
  );

  const goToCart = useCallback(() => {
    if (cart.length === 0) {
      Alert.alert("Your cart is empty.");
    } else {
      router.push("./cart");
    }
  }, [cart.length, router]);

  const getProductRating = useCallback(
    (productId: string) => {
      const existingRating = productRatings[productId] || {
        rating: 0,
        userCount: 0,
      };
      const userRating = userRatings[productId];

      if (userRating) {
        const totalRating =
          existingRating.rating * existingRating.userCount + userRating;
        const totalCount = existingRating.userCount + 1;
        return {
          rating: totalRating / totalCount,
          userCount: totalCount,
        };
      }
      return existingRating;
    },
    [userRatings]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const handleSearch = useCallback(
    debounce((query: string) => {
      const lowercasedQuery = query.toLowerCase();
      let filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedQuery)
      );

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );

      setFilteredProducts((prevProducts) => {
        if (areArraysEqual(prevProducts, filtered)) {
          return prevProducts;
        } else {
          return filtered;
        }
      });
    }, 300),
    [products, selectedCategories, priceRange]
  );

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const toggleWishlistItem = useCallback(
    (product: CartItem) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);

      if (isInWishlist) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.id !== product.id)
        );
        Alert.alert(
          "Removed from Wishlist",
          `${product.name} has been removed from your wishlist.`
        );
      } else {
        setWishlist((prevWishlist) => [...prevWishlist, product]);
      }
    },
    [wishlist, setWishlist]
  );

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Helper function to compare arrays
  const areArraysEqual = (arr1: CartItem[], arr2: CartItem[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item.id === arr2[index].id);
  };

  // Memoized component to render each product
  interface ProductItemProps {
    item: CartItem;
    index: number;
    cardWidth: number;
  }

  const ProductItem: React.FC<ProductItemProps> = ({
    item,
    index,
    cardWidth,
  }) => {
    const [loading, setLoading] = useState(true);

    // Retrieve the rating using the getProductRating function
    const productRating = getProductRating(item.id);

    // Check if item is in the wishlist
    const isInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    return (
      <View style={{ width: cardWidth, margin: 8 }}>
        <Card style={[styles.productCard, { backgroundColor: colors.surface }]}>
          <View style={styles.imageContainer}>
            {loading && (
              <ActivityIndicator
                animating={true}
                size="small"
                color={colors.primary}
                style={styles.loader}
              />
            )}

            <Image
              source={{ uri: item.imageUrl }}
              style={[
                styles.productImage,
                { backgroundColor: theme.dark ? "#333" : "#f0f0f0" },
                loading && { opacity: 0 },
              ]}
              resizeMode="contain"
              onLoadEnd={() => setLoading(false)}
            />

            {/* Wishlist Icon */}
            <TouchableOpacity
              style={styles.wishlistIcon}
              onPress={() => toggleWishlistItem(item)}
            >
              <Icon
                name={isInWishlist ? "heart" : "heart-outline"}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <Card.Content>
            <Text style={[styles.productName, { color: colors.onSurface }]}>
              {item.name}
            </Text>
            <Text style={{ color: colors.onSurface }}>
              ${item.price.toFixed(2)}
            </Text>

            {/* Display the product's average rating */}
            <View style={styles.ratingContainer}>
              <CustomRating
                rating={productRating.rating}
                maxRating={5}
                size={20}
                isDisabled={true}
              />
              <Text style={{ color: colors.onSurfaceVariant, marginLeft: 5 }}>
                {productRating.rating.toFixed(1)} ({productRating.userCount}{" "}
                reviews)
              </Text>
            </View>
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <ReanimatedButton
              label="Add to Cart"
              onPress={() => addToCart(item)}
            />
          </Card.Actions>
        </Card>
      </View>
    );
  };

  // Memoize the ProductItem component
  const MemoizedProductItem = React.memo(ProductItem);

  const renderItem: ListRenderItem<CartItem> = ({ item, index }) => (
    <MemoizedProductItem
      item={item}
      index={index}
      cardWidth={width >= 768 ? width / 2 - 16 : width - 32}
    />
  );

  // Functions to handle filters
  const toggleCategory = useCallback(
    (category: string) => {
      setSelectedCategories((prev) => {
        if (prev.includes(category)) {
          return prev.filter((cat) => cat !== category);
        } else {
          return [...prev, category];
        }
      });
    },
    [setSelectedCategories]
  );

  const applyFilters = useCallback(() => {
    setFilterVisible(false);
    handleSearch(searchQuery);
  }, [setFilterVisible, handleSearch, searchQuery]);

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setFilterVisible(false);
    handleSearch(searchQuery);
  }, [
    setSelectedCategories,
    setPriceRange,
    setFilterVisible,
    handleSearch,
    searchQuery,
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: colors.surface }]}
        inputStyle={{ color: colors.onSurface }}
        placeholderTextColor={colors.onSurfaceVariant}
        iconColor={colors.onSurface}
      />

      {/* Filter Button */}
      <Button
        icon="filter"
        mode="outlined"
        onPress={() => setFilterVisible(true)}
        style={styles.filterButton}
        labelStyle={{ color: colors.primary }}
      >
        Filter
      </Button>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={{
                    color: colors.onSurface,
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                >
                  Filter by Category
                </Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.checkboxRow}
                      onPress={() => toggleCategory(category)}
                    >
                      <Checkbox
                        status={
                          selectedCategories.includes(category)
                            ? "checked"
                            : "unchecked"
                        }
                        color={colors.primary}
                      />
                      <Text style={{ color: colors.onSurface, flex: 1 }}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.modalButtons}>
                  <Button
                    mode="text"
                    onPress={resetFilters}
                    style={styles.modalButton}
                    labelStyle={{ color: colors.error }}
                  >
                    Reset
                  </Button>
                  <Button
                    mode="contained"
                    onPress={applyFilters}
                    style={styles.modalButton}
                    labelStyle={{ color: colors.onPrimary }}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* FlatList for Products */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={10}
        windowSize={5}
      />

      {/* Cart Floating Action Button */}
      <View style={styles.fabContainer}>
        <Animated.View style={{ transform: [{ scale: cartAnimation }] }}>
          <FAB
            style={[styles.fabCart, { backgroundColor: colors.primary }]}
            icon="cart"
            onPress={goToCart}
            color={colors.onPrimary}
          />
          {cart.length > 0 && (
            <Badge style={[styles.badge, { backgroundColor: colors.error }]}>
              {cart.length}
            </Badge>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

// **STYLES**
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  filterButton: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 120,
  },
  productCard: {
    borderRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  loader: {
    position: "absolute",
  },
  cardActions: {
    justifyContent: "center",
    padding: 8,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fabCart: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    color: "#FFFFFF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  wishlistIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    maxHeight: "70%",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  productName: {
    marginTop: 8,
    fontWeight: "bold",
  },
});

export default ShopScreen;
