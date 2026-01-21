import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { ProductCard } from "../../components/ProductCard";
import { Input } from "../../components/Input";
import api from "./../services/api";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Other"];

  const fetchItems = async (pageNum = 1, shouldRefresh = false) => {
    try {
      if (pageNum === 1) setLoading(true); // Initial load or refresh
      
      const response = await api.get(`/items?page=${pageNum}&limit=10`);
      const newItems = response.data;

      if (shouldRefresh || pageNum === 1) {
        setItems(newItems);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === 10);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // For simplicity in this demo, refreshing on focus resets to page 1
      fetchItems(1, true);
      setPage(1);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchItems(1, true);
  };

  const loadMore = () => {
    if (!hasMore || isLoadingMore || loading) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.title}>DormDeal</Text>
        <Text style={styles.subtitle}>Campuses • Community • Commerce</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </View>

      <View style={styles.categories}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              id={item._id}
              title={item.title}
              price={item.price}
              condition={item.condition}
              imageUrl={item.imageUrl}
              status={item.status}
              createdAt={item.createdAt}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.light.primary} style={{ marginVertical: 20 }} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  categories: {
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    marginRight: 8,
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
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 16,
  },
});
