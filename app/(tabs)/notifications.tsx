import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import api from "../services/api";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [user])
  );

  const handleNotificationPress = async (notification: any) => {
    if (!notification.isRead) {
      await handleMarkRead(notification._id);
    }
    
    if (notification.itemId) {
      // Navigate to the product details
      // Using 'as any' to bypass strict routing types if dynamic route is tricky
      router.push(`/product/${notification.itemId}` as any);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Optimistically update
      setNotifications(prev => 
        prev.map((n: any) => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error("Error marking read");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.item, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={item.isRead ? "notifications-outline" : "notifications"} 
          size={24} 
          color={item.isRead ? Colors.light.textSecondary : Colors.light.primary} 
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {!user ? (
        <View style={styles.center}>
            <Text style={styles.infoText}>Please login to view notifications</Text>
        </View>
      ) : (
        <FlatList
            data={notifications}
            keyExtractor={(item: any) => item._id}
            renderItem={renderItem}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotifications(); }} />
            }
            ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.infoText}>No notifications yet</Text>
            </View>
            }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  item: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
  },
  unreadItem: {
    backgroundColor: "#EEF2FF", // Light indigo tint
    borderColor: "#C7D2FE",
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  unreadText: {
    color: Colors.light.primary,
  },
  message: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  infoText: {
    color: Colors.light.textSecondary,
    fontSize: 16,
  },
});
