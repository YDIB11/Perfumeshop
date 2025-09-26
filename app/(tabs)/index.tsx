// app/screens/HomeScreen.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import {
  useTheme,
  Avatar,
  Switch,
  IconButton,
  TouchableRipple,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ReanimatedButton from "../animations/ReanimatedButton";

const HomeScreen: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();
  const { colors } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Get screen dimensions for better layout control
  const { height, width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Memoized feature card data
  const features = useMemo(
    () => [
      {
        icon: "truck-fast",
        title: "Fast Delivery",
        description: "Get your orders delivered swiftly.",
        detailDescription:
          "We offer same-day delivery in selected areas and fast shipping across the country. Our logistics partners ensure your orders reach you as quickly as possible.",
      },
      {
        icon: "tag-heart",
        title: "Best Prices",
        description: "Unbeatable prices on all products.",
        detailDescription:
          "We negotiate directly with manufacturers to bring you the best prices without compromising on quality. Enjoy great savings and exclusive deals.",
      },
      {
        icon: "shield-check",
        title: "Secure Payment",
        description: "Your data is safe with us.",
        detailDescription:
          "Our payment gateway is encrypted with the latest technology, ensuring your personal and financial information remains confidential and secure.",
      },
      {
        icon: "star-face",
        title: "Top Quality",
        description: "We offer only the best.",
        detailDescription:
          "All our products undergo strict quality control checks to meet the highest standards. We source from trusted brands to provide you with top-quality items.",
      },
    ],
    []
  );

  // New: Special offers data
  const specialOffers = useMemo(
    () => [
      {
        image: require("@/assets/offer.png"),
        title: "Summer Sale",
        description: "Up to 50% off on selected items.",
      },
      {
        image: require("@/assets/offer.png"),
        title: "Buy One Get One Free",
        description: "Limited time offer on select products.",
      },
      {
        image: require("@/assets/offer.png"),
        title: "Free Shipping",
        description: "On orders over $100.",
      },
    ],
    []
  );

  // Open modal with feature content
  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero Section */}
      <View style={[styles.heroContainer, { height: height * 0.8 }]}>
        <LinearGradient
          colors={
            theme === "light" ? ["#ffffff", "#f2f2f2"] : ["#121212", "#1d1d1d"]
          }
          style={styles.heroBackground}
        />
        <Image
          source={
            theme === "light"
              ? require("@/assets/hero-light.jpg")
              : require("@/assets/hero-dark.jpg")
          }
          style={styles.heroImage}
          resizeMode="contain"
        />
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { color: colors.onBackground }]}>
            Welcome to Our Shop
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.onBackground }]}>
            Discover the best products just for you
          </Text>
          {/* Reanimated Button for 'Start Shopping' */}
          <ReanimatedButton
            label="Start Shopping"
            onPress={() => router.push("./shop")}
          />
        </View>
      </View>

      {/* Feature Highlights */}
      <View
        style={[
          styles.featuresContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Why Shop With Us?
        </Text>
        <View style={styles.featuresRow}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              detailDescription={feature.detailDescription}
              openModal={openModal}
            />
          ))}
        </View>
      </View>

      {/* New: Special Offers Section */}
      <View
        style={[styles.offersContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Special Offers
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersRow}
        >
          {specialOffers.map((offer, index) => (
            <OfferCard
              key={index}
              image={offer.image}
              title={offer.title}
              description={offer.description}
            />
          ))}
        </ScrollView>
      </View>

      {/* Theme Toggle */}
      <View
        style={[
          styles.themeToggleContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.switchContainer}>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            color={colors.primary}
            accessibilityLabel={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}
          />
          <IconButton
            icon={theme === "light" ? "weather-sunny" : "weather-night"}
            size={32}
            style={[styles.themeIcon, { color: colors.onBackground }]}
          />
        </View>
        <Text style={[styles.themeToggleText, { color: colors.onBackground }]}>
          {theme === "light" ? "Light Mode" : "Dark Mode"}
        </Text>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
          © 2023 DEEPP
        </Text>
      </View>

      {/* Modal for Feature Details */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
              {modalContent?.title}
            </Text>
            <Text
              style={[styles.modalDescription, { color: colors.onSurface }]}
            >
              {modalContent?.description}
            </Text>
            <ReanimatedButton
              label="Close"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// FeatureCard component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  detailDescription: string;
  openModal: (title: string, description: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  detailDescription,
  openModal,
}) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <TouchableRipple
      onPress={() => openModal(title, detailDescription)}
      rippleColor="rgba(0, 0, 0, .05)"
      style={[
        styles.featureCard,
        { width: isTablet ? "45%" : "100%", marginBottom: 16 },
      ]}
    >
      <View style={styles.featureCardContent}>
        <Avatar.Icon
          icon={icon}
          size={isTablet ? 64 : 48}
          color={colors.onPrimary}
          style={{ backgroundColor: colors.primary }}
        />
        <Text
          style={[
            styles.featureTitle,
            { color: colors.onBackground, fontSize: isTablet ? 18 : 16 },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.featureDescription,
            { color: colors.onSurface, fontSize: isTablet ? 16 : 14 },
          ]}
        >
          {description}
        </Text>
      </View>
    </TouchableRipple>
  );
};

// New: OfferCard component
interface OfferCardProps {
  image: any;
  title: string;
  description: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ image, title, description }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View
      style={[
        styles.offerCard,
        { width: isTablet ? width * 0.4 : width * 0.7 },
      ]}
    >
      <Image source={image} style={styles.offerImage} resizeMode="cover" />
      <View style={styles.offerContent}>
        <Text style={[styles.offerTitle, { color: colors.onSurface }]}>
          {title}
        </Text>
        <Text style={[styles.offerDescription, { color: colors.onSurface }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heroContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heroBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heroImage: {
    width: "70%",
    height: "40%",
  },
  heroContent: {
    paddingVertical: 30,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  featuresContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    borderRadius: 8,
    elevation: 2,
  },
  featureCardContent: {
    alignItems: "center",
    padding: 16,
  },
  featureTitle: {
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  featureDescription: {
    textAlign: "center",
    marginTop: 4,
  },
  // New styles for offers section
  offersContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  offersRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  offerCard: {
    borderRadius: 8,
    marginRight: 16,
    overflow: "hidden",
    elevation: 2,
  },
  offerImage: {
    width: "100%",
    height: 150,
  },
  offerContent: {
    padding: 10,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  offerDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  themeToggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 40,
    paddingHorizontal: 16,
  },
  themeToggleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeIcon: {
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
