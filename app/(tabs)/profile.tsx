import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { Button } from "../../components/Button";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!user) return;
      setLoadingItems(true);
      try {
        const res = await api.get("/items");
        const all = res.data || [];
        const mine = all.filter(
          (item: any) =>
            !item.isDeleted &&
            item.sellerId &&
            (item.sellerId._id === user._id || item.sellerId === user._id)
        );
        setMyItems(mine);
      } catch (e) {
        // fail silently on profile; main feed still works
        console.error("Failed to load my items", e);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchMyItems();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login" as any);
  };

  if (!user) {
    return (
        <ScreenWrapper>
            <View style={styles.center}>
                <Text style={styles.infoText}>Please login to view profile</Text>
                <Button title="Login" onPress={() => router.push("/(auth)/login" as any)} style={{marginTop: 20, width: 200}} />
            </View>
        </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.infoCard}>
                <InfoItem icon="call-outline" label="Phone" value={user.phoneNumber} />
                <InfoItem icon="home-outline" label="Room" value={user.roomNumber} />
                <InfoItem icon="school-outline" label="Year" value={user.year} />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.option} onPress={() => router.push("/(tabs)/edit-profile" as any)}>
                <View style={styles.optionLeft}>
                    <Ionicons name="create-outline" size={24} color={Colors.light.text} />
                    <Text style={styles.optionText}>Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} />
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          {loadingItems ? (
            <View style={styles.myItemsLoading}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          ) : myItems.length === 0 ? (
            <Text style={styles.emptyText}>You haven't posted any items yet.</Text>
          ) : (
            <View style={styles.myItemsList}>
              {myItems.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.myItemCard}
                  onPress={() => router.push(`/product/${item._id}` as any)}
                  activeOpacity={0.9}
                >
                  <View style={styles.myItemHeader}>
                    <Text style={styles.myItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.myItemPrice}>₹{item.price}</Text>
                  </View>
                  <View style={styles.myItemMeta}>
                    <Text style={styles.myItemStatus}>
                      {item.status === "sold" ? "Sold" : "Available"}
                    </Text>
                    <Text style={styles.myItemDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutBtn}
        />
        
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.infoItem}>
        <View style={styles.infoIcon}>
            <Ionicons name={icon} size={20} color={Colors.light.primary} />
        </View>
        <View>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  infoText: {
      fontSize: 16,
      color: Colors.light.textSecondary
  },
  header: {
    alignItems: "center",
    marginVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  myItemsLoading: {
    paddingVertical: 8,
  },
  myItemsList: {
    gap: 8,
  },
  myItemCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  myItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  myItemTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
  },
  myItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  myItemMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  myItemStatus: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.textSecondary,
  },
  myItemDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  logoutBtn: {
    marginTop: 20,
    borderColor: Colors.light.error,
  },
  version: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
