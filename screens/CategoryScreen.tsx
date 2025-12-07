import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";

import { getChildCategories, CategoryEntity } from "../lib/database/category";

type NavProp = StackNavigationProp<RootStackParamList, "Category">;
type RouteProps = RouteProp<RootStackParamList, "Category">;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function CategoryScreen({ navigation, route }: Props) {
  const {parentId} = route.params;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getChildCategories(parentId);
    setCategories(data);
    setLoading(false);
  }

  function handlePress(cat: CategoryEntity) {
    navigation.push("Category", {
      parentId: cat.id,
      title: cat.name,
    });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#104E8B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={styles.categoryButton}
          onPress={() => handlePress(cat)}
        >
          <Text style={styles.categoryText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}

      {categories.length === 0 && (
        <View style={styles.noChildContainer}>
          <Text style={styles.noChildText}>
            No more child categories. You reached the end.
          </Text>
          <Text style={styles.noChildTextSecondary}>
            🟡 TODO → load ilanlar for {parentId}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  categoryButton: {
    paddingVertical: 18,
    borderBottomWidth: 0.4,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noChildContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  noChildText: {
    fontSize: 16,
    fontWeight: "600",
  },
  noChildTextSecondary: {
    marginTop: 4,
    fontSize: 14,
    color: "gray",
  },
});