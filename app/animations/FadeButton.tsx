import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface FadeButtonProps {
  label: string;
  onPress: () => void;
  style?: any; // Style passed as prop for external control
}

const FadeButton: React.FC<FadeButtonProps> = ({ label, onPress, style }) => {
  const opacity = useSharedValue(1); // Start opacity at 1 (visible)

  // Animated style that changes opacity
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 300 }), // Timing animation for smooth fade
    };
  });

  const handlePressIn = () => {
    opacity.value = 0.5; // Fade effect on press
  };

  const handlePressOut = () => {
    opacity.value = 1; // Restore opacity
    onPress(); // Trigger the provided onPress action
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, style]} // Merge button styles with external styles
    >
      {/* Wrap text content in Animated.View */}
      <Animated.View style={animatedStyle}>
        <Text style={styles.buttonText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FadeButton;
