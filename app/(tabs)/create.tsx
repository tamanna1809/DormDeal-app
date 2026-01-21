import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import api from "../services/api";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const categories = ["Books", "Electronics", "Furniture", "Clothing", "Other"];

export default function CreateItem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3, // Reduced quality to minimize payload size
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Info = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64Info);
    }
  };

  const handleImageUrlChange = (value: string) => {
    if (!value) {
      setImage(null);
      return;
    }
    setImage(value);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.title?.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!formData.price?.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    if (!formData.category?.trim()) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!formData.condition?.trim()) {
      Alert.alert("Error", "Please enter the condition");
      return;
    }
    if (!image) {
      Alert.alert("Error", "Please add an image");
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        title: formData.title.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        condition: formData.condition.trim(),
        imageUrl: image,
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      await api.post("/items", payload);
      Alert.alert("Success", "Item posted successfully!");
      router.replace("/(tabs)");
      setFormData({ title: "", description: "", price: "", category: "", condition: "" });
      setImage(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to post item";
      console.error("Post item error:", errorMessage, error.response?.data);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sell an Item</Text>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={40} color={Colors.light.textSecondary} />
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.label}>Or paste Image URL (optional)</Text>
        <Input
           placeholder="https://..."
           value={image && !image.startsWith("data:") ? image : ""}
           onChangeText={handleImageUrlChange}
        />

        <View style={styles.form}>
          <Input
            label="Title"
            placeholder="What are you selling?"
            value={formData.title}
            onChangeText={(text) => handleChange("title", text)}
          />
          <Input
            label="Price (₹)"
            placeholder="0"
            value={formData.price}
            onChangeText={(text) => handleChange("price", text)}
            keyboardType="numeric"
          />
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    formData.category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => handleChange("category", cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Input
            label="Condition"
            placeholder="New, Used - Good, Used - Fair"
            value={formData.condition}
            onChangeText={(text) => handleChange("condition", text)}
          />
          <Input
            label="Description"
            placeholder="Describe your item..."
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Button
            title="Post Item"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  imagePicker: {
    height: 200,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: Colors.light.textSecondary,
  },
  form: {
    marginBottom: 40,
  },
  button: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
});
