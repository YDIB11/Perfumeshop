// components/CustomRating.tsx

import React from "react";
import { View, TouchableOpacity } from "react-native";
import { IconButton as PaperIconButton, useTheme } from "react-native-paper";

interface CustomRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  isDisabled?: boolean;
}

const CustomRating: React.FC<CustomRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange = () => {},
  isDisabled = false,
}) => {
  const { colors } = useTheme();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          disabled={isDisabled}
          onPress={() => onRatingChange(i)}
        >
          <PaperIconButton
            icon={i <= rating ? "star" : "star-outline"}
            size={size}
            style={{ margin: 0 }} // Remove default margin if necessary
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
};

export default CustomRating;
