import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}

export const Badge = ({ label, variant = "default" }: BadgeProps) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "success": return "#D1FAE5";
      case "warning": return "#FEF3C7";
      case "error": return "#FEE2E2";
      default: return "#E5E7EB";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "success": return "#065F46";
      case "warning": return "#92400E";
      case "error": return "#991B1B";
      default: return "#374151";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
