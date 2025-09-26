import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ReanimatedButtonProps {
  label: string;
  onPress: () => void;
}

const ReanimatedButton: React.FC<ReanimatedButtonProps> = ({
  label,
  onPress,
}) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 300 }),
  }));

  return (
    <TouchableOpacity
      onPressIn={() => {
        opacity.value = 0.5;
      }}
      onPressOut={() => {
        opacity.value = 1;
        onPress();
      }}
      style={styles.button}
    >
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

export default ReanimatedButton;
