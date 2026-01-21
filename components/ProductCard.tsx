import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  imageUrl: string;
  status: "available" | "sold";
  createdAt: string;
}

export const ProductCard = ({
  id,
  title,
  price,
  condition,
  imageUrl,
  status,
  createdAt,
}: ProductCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${id}`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl || "https://via.placeholder.com/300" }}
          style={styles.image}
          contentFit="cover"
        />
        {status === "sold" && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, styles.conditionBadge]}>
            <Text style={styles.badgeText}>{condition}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>₹{price}</Text>
          <Text style={styles.time}>{new Date(createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: "48%", // 2 column layout capability
  },
  imageContainer: {
    height: 140,
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  soldBadge: {
    backgroundColor: Colors.light.error,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  time: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  title: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  soldText: {
    color: "#EF4444",
    fontSize: 20,
    fontWeight: "900",
    transform: [{ rotate: "-15deg" }],
    borderWidth: 4,
    borderColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    letterSpacing: 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});
