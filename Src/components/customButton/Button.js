import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ text, onPress, backgroundColor = "#6200EE", textColor = "#FFFFFF", disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: disabled ? "#BDBDBD" : backgroundColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
