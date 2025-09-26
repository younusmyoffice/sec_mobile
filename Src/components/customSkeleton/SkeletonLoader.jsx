import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const SkeletonLoader = ({
  width = "100%",
  height = 20,
  borderRadius = 18,
  color = "white",
  highlightColor = "#E6E1E5",
  style,
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerValue]);

  const shimmerBackground = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [color, highlightColor],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: shimmerBackground,
        },
        style,
      ]}
    />
  );
};

export default SkeletonLoader;
