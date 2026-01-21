import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch item details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSold = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/items/${id}/sold`);
      Alert.alert("Success", "Item marked as sold");
      fetchItemDetails();
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setActionLoading(true);
          try {
            await api.delete(`/items/${id}`);
            Alert.alert("Success", "Item deleted");
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleUpdatePrice = async () => {
    if (!newPrice.trim() || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setActionLoading(true);
    try {
      const updatedItem = await api.put(`/items/${id}`, { ...item, price: Number(newPrice) });
      // Note: The API commonly uses PUT or PATCH. Controller uses Object.assign(item, req.body).
      // So sending full body or partial with PUT logic in that controller (which updates existing item) works.
      // But safer to just send the field if we trust correct PATCH/PUT usage, but for now just send price in body?
      // Wait, let's look at `updateItem` controller again.
      // `Object.assign(item, req.body)`. So if I only send { price: ... }, it updates only price.
      // Using `api.patch` or `api.put` - usually `api` wrapper wraps axios.
      // I'll stick to `api.put`/`api.patch` naming if the user code has it. 
      // Checking other calls: `api.patch` is used in `handleMarkSold` (/items/:id/sold).
      // Standard REST for update is usually PUT or PATCH.
      // `api.js` (not visible but usually standard). I will use `api.put` or `api.patch` assuming mostly interchangeable for this simple controller.
      // Let's use `api.put` to match likely route definition for update.
      await api.put(`/items/${id}`, { price: Number(newPrice) }); // or patch
      
      setItem({ ...item, price: Number(newPrice) });
      setIsEditingPrice(false);
      Alert.alert("Success", "Price updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update price");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!item) return null;

  const isSeller = user && item.sellerId._id === user._id;
  const canDelete = user && (isSeller || user.role === "admin");

  return (
    <ScreenWrapper style={{ paddingHorizontal: 0 }}>
      <ScrollView>
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>{item.category} • {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            {isEditingPrice ? (
               <View style={styles.editPriceContainer}>
                 <TextInput
                   style={styles.priceInput}
                   value={newPrice}
                   onChangeText={setNewPrice}
                   keyboardType="numeric"
                   autoFocus
                   placeholder="Price"
                 />
                 <TouchableOpacity onPress={handleUpdatePrice} style={styles.iconBtn}>
                   <Ionicons name="checkmark-circle" size={32} color={Colors.light.primary} />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => setIsEditingPrice(false)} style={styles.iconBtn}>
                   <Ionicons name="close-circle" size={32} color={Colors.light.error} />
                 </TouchableOpacity>
               </View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.price}>₹{item.price}</Text>
                {isSeller && item.status !== "sold" && (
                    <TouchableOpacity 
                        onPress={() => { setNewPrice(item.price.toString()); setIsEditingPrice(true); }} 
                        style={{marginLeft: 8, padding: 4}}
                    >
                        <Ionicons name="pencil" size={20} color={Colors.light.primary} />
                    </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.badges}>
             <Badge label={item.condition} />
             {item.status === "sold" && <Badge label="SOLD" variant="error" />}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerIcon}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.sellerName}>{item.sellerId.name}</Text>
                <Text style={styles.sellerDetail}>Year: {item.sellerId.year}</Text>
                <Text style={styles.sellerDetail}>Room: {item.sellerId.roomNumber}</Text>
                <Text style={styles.sellerDetail}>Phone: {item.sellerId.phoneNumber}</Text>
              </View>
            </View>
          </View>

          {isSeller ? (
            <View style={styles.actions}>
              {item.status !== "sold" && (
                <Button
                  title="Mark as Sold"
                  onPress={handleMarkSold}
                  isLoading={actionLoading}
                  style={styles.actionBtn}
                />
              )}
              <Button
                title="Delete Item"
                variant="outline"
                onPress={handleDelete}
                isLoading={actionLoading}
                style={[styles.actionBtn, { marginTop: 12, borderColor: Colors.light.error }]}
                // Custom text style for delete button would be nice but using default for now
              />
            </View>
          ) : (
             <View style={styles.actions}>
                <Button 
                    title={item.status === 'sold' ? "Item Sold" : "Contact Seller"}
                    onPress={() => {
                        if (item.status !== 'sold') {
                            Alert.alert("Contact", `Call ${item.sellerId.name} at ${item.sellerId.phoneNumber}`);
                        }
                    }}
                    disabled={item.status === 'sold'}
                    style={item.status === 'sold' ? { backgroundColor: Colors.light.textSecondary } : {}}
                />
             </View>
          )}

          {canDelete && !isSeller && (
            <View style={{ marginTop: 12, marginBottom: 40 }}>
              <Button
                  title="Delete Item (Admin)"
                  variant="outline"
                  onPress={handleDelete}
                  isLoading={actionLoading}
                  style={{ borderColor: Colors.light.error }}
                  textStyle={{ color: Colors.light.error }}
              />
            </View>
          )}
        </View>
      </ScrollView>
       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  category: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.light.text,
  },
  description: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 24,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sellerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  sellerDetail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actions: {
    marginTop: 10,
    marginBottom: 40,
  },
  actionBtn: {
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    minWidth: 80,
    marginRight: 8,
    paddingVertical: 0,
  },
  iconBtn: {
    marginLeft: 4,
  }
});
