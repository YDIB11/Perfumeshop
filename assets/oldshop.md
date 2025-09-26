// app/shop.tsx

import React, { useState, useRef, useEffect } from "react";
import {
View,
StyleSheet,
Alert,
Modal,
FlatList,
ListRenderItem,
Animated,
useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import {
Text,
Button,
Card,
TextInput,
FAB,
Searchbar,
Badge,
} from "react-native-paper";
import { CartItem } from "./types";
import { useShopContext } from "../contexts/ShopContext";

const ShopScreen: React.FC = () => {
const theme = useTheme();
const colors = theme.colors;
const router = useRouter();
const { products, setProducts, cart, setCart } = useShopContext();
const [modalVisible, setModalVisible] = useState(false);
const [productName, setProductName] = useState("");
const [productPrice, setProductPrice] = useState("");
const [productImageUrl, setProductImageUrl] = useState("");
const [editIndex, setEditIndex] = useState<number | null>(null);
const [searchQuery, setSearchQuery] = useState("");

const { width } = useWindowDimensions();

// Define number of columns based on screen width
const numColumns = width >= 768 ? 2 : 1; // 768 is a common breakpoint for tablets

// Define margin and padding
const cardMargin = 8;
const listPadding = 16;

// Calculate card width
const cardWidth =
(width - listPadding _ 2 - cardMargin _ (numColumns \* 2)) / numColumns;

const filteredProducts = products.filter((product) =>
product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const cartAnimation = useRef(new Animated.Value(1)).current;

const animateCart = () => {
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
};

const addToCart = (product: CartItem) => {
setCart((prevCart) => [...prevCart, product]);
Alert.alert("Success", `${product.name} added to cart.`);
animateCart();
};

const goToCart = () => {
if (cart.length === 0) {
Alert.alert("Your cart is empty.");
} else {
router.push("./cart");
}
};

const localImages: { [key: string]: any } = {
"xerjoff-torino22.png": require("../assets/images/xerjoff-torino22.png"),
// Add more local images here
};

const handleAddProduct = () => {
if (productName && productPrice) {
// Check if image is local or remote
const imageSource =
localImages[productImageUrl] ||
productImageUrl ||
"https://via.placeholder.com/150";

      const newProduct: CartItem = {
        id:
          editIndex !== null
            ? products[editIndex].id
            : `${products.length + 1}`,
        name: productName,
        price: parseFloat(productPrice),
        imageUrl: imageSource, // Use either the local image or the remote URL
      };

      if (editIndex !== null) {
        const updatedProducts = [...products];
        updatedProducts[editIndex] = newProduct;
        setProducts(updatedProducts);
      } else {
        setProducts([...products, newProduct]);
      }

      setProductName("");
      setProductPrice("");
      setProductImageUrl("");
      setModalVisible(false);
      setEditIndex(null);
    } else {
      Alert.alert("Error", "Please fill in all required fields.");
    }

};
const handleEditProduct = (index: number) => {
const product = products[index];
setProductName(product.name);
setProductPrice(product.price.toString());

    // If the image is a local image, we assume the productImageUrl is the key from the localImages map
    if (typeof product.imageUrl !== "string") {
      const localImageKey = Object.keys(localImages).find(
        (key) => localImages[key] === product.imageUrl
      );
      setProductImageUrl(localImageKey || "");
    } else {
      setProductImageUrl(product.imageUrl); // Otherwise, it’s a remote URL
    }

    setEditIndex(index);
    setModalVisible(true);

};

const handleDeleteProduct = (index: number) => {
Alert.alert(
"Confirm Delete",
"Are you sure you want to delete this product?",
[
{ text: "Cancel", style: "cancel" },
{
text: "Delete",
style: "destructive",
onPress: () => {
const updatedProducts = products.filter((_, i) => i !== index);
setProducts(updatedProducts);
},
},
]
);
};

// Create a memoized component for each product item
interface ProductItemProps {
item: CartItem;
index: number;
cardWidth: number;
}

const ProductItem: React.FC<ProductItemProps> = React.memo(
({ item, index, cardWidth }) => (
<View style={{ width: cardWidth, margin: cardMargin }}>
<Card style={styles.productCard}>
<Card.Cover
source={
typeof item.imageUrl === "string" &&
item.imageUrl.startsWith("http")
? { uri: item.imageUrl } // Remote image URL (for network images)
: localImages[item.imageUrl] // Local image (from require)
}
style={styles.productImage}
resizeMode="contain"
/>

          <Card.Content>
            <Text
              style={{
                color: colors.onSurface,
                marginTop: 8,
                fontWeight: "bold",
              }}
            >
              {item.name}
            </Text>
            <Text style={{ color: colors.onSurface }}>
              ${item.price.toFixed(2)}
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" onPress={() => addToCart(item)}>
              Add to Cart
            </Button>
            <Button mode="outlined" onPress={() => handleEditProduct(index)}>
              Edit
            </Button>
            <Button
              mode="text"
              onPress={() => handleDeleteProduct(index)}
              textColor={colors.error}
            >
              Delete
            </Button>
          </Card.Actions>
        </Card>
      </View>
    )

);

const renderItem: ListRenderItem<CartItem> = ({ item, index }) => (
<ProductItem item={item} index={index} cardWidth={cardWidth} />
);

return (
<View style={[styles.container, { backgroundColor: colors.background }]}>
<Searchbar
placeholder="Search"
onChangeText={setSearchQuery}
value={searchQuery}
style={styles.searchBar}
inputStyle={{ color: colors.onSurface }}
placeholderTextColor={colors.onSurfaceVariant}
iconColor={colors.onSurface}
/>
<FlatList
data={filteredProducts}
keyExtractor={(item) => item.id}
renderItem={renderItem}
numColumns={numColumns}
key={numColumns} // Forces FlatList to re-render when numColumns changes
contentContainerStyle={styles.listContent}
showsVerticalScrollIndicator={false}
/>

      {/* Cart FAB with Badge and Animation */}
      <View style={styles.fabContainer}>
        <Animated.View style={{ transform: [{ scale: cartAnimation }] }}>
          <FAB
            style={styles.fabCart}
            icon="cart"
            onPress={goToCart}
            color={colors.onPrimary}
            theme={{ colors: { primary: colors.primary } }}
          />
          {cart.length > 0 && (
            <Badge style={[styles.badge, { backgroundColor: colors.error }]}>
              {cart.length}
            </Badge>
          )}
        </Animated.View>
      </View>

      {/* Add Product FAB */}
      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => setModalVisible(true)}
        color={colors.onPrimary}
        theme={{ colors: { primary: colors.primary } }}
      />

      {/* Modal for adding/editing products */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
              {editIndex !== null ? "Edit Product" : "Add Product"}
            </Text>
            <TextInput
              label="Product Name"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Product Price"
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Image URL"
              value={productImageUrl}
              onChangeText={setProductImageUrl}
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={handleAddProduct}
              style={styles.modalButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {editIndex !== null ? "Save Changes" : "Add Product"}
            </Button>
            <Button
              mode="text"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
              labelStyle={[styles.buttonLabel, { color: colors.primary }]}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>

);
};

// **STYLES**
const styles = StyleSheet.create({
container: {
flex: 1,
},
searchBar: {
margin: 16,
borderRadius: 8,
},
listContent: {
paddingHorizontal: 16,
paddingBottom: 120, // Space for FABs
},
columnWrapper: {
justifyContent: "space-around", // Adjusted to 'space-around' or 'space-evenly'
},
productCard: {
borderRadius: 8,
elevation: 2,
backgroundColor: "transparent", // To allow theme-based background
},
productImage: {
width: "100%",
height: 200, // Adjust height as needed
backgroundColor: "#f0f0f0", // Placeholder color while image loads
borderTopLeftRadius: 8,
borderTopRightRadius: 8,
},
cardActions: {
justifyContent: "space-between",
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
fabAdd: {
position: "absolute",
right: 16,
bottom: 86, // Positioned above the cart FAB
},
badge: {
position: "absolute",
top: -4,
right: -4,
color: "#FFFFFF",
},
modalBackground: {
flex: 1,
backgroundColor: "rgba(0, 0, 0, 0.5)",
justifyContent: "center",
paddingHorizontal: 16,
},
modalContainer: {
padding: 20,
borderRadius: 8,
},
modalTitle: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 15,
textAlign: "center",
},
input: {
marginBottom: 12,
},
modalButton: {
marginTop: 12,
borderRadius: 8,
},
cancelButton: {
marginTop: 8,
borderRadius: 8,
},
// Newly added styles for buttons
buttonContent: {
paddingVertical: 8,
paddingHorizontal: 16,
},
buttonLabel: {
fontSize: 16,
fontWeight: "bold",
},
});

export default ShopScreen;
