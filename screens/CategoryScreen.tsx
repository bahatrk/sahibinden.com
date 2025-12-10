import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/types";


import {
  getChildCategories,
  CategoryEntity,
} from "../lib/database/category";
import {
  getListingsWithData,
  ListingWithData,
} from "../lib/database/listing";
import ListingItem from "../components/ListingItem";
import CategoryItem from "../components/CategoryItem";

type NavProp = StackNavigationProp<RootStackParamList, "Category">;
type RouteProps = RouteProp<RootStackParamList, "Category">;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function CategoryScreen({ navigation, route }: Props) {
  const category = route.params; // because we passed {cat}

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [listings, setListings] = useState<ListingWithData[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const childCats = await getChildCategories(category.id);

    if (childCats.length > 0) {
      setCategories(childCats);
      setListings([]);
    } else {
      const items = await getListingsWithData(category.id);
      setListings(items);
    }

    setLoading(false);
  }

  function handlePress(cat: CategoryEntity) {
    navigation.push("Category", cat );
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
      {/* 📌 CASE 1 → Show child categories */}
      {categories.length > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem category={item} onPress={handlePress} />  
          )}
        />
      )}

      {/* 📌 CASE 2 → No children → Show listings */}
      {categories.length === 0 && (
        <View style={{ marginTop: 10 }}>
          {listings.map((ls) => (
            <ListingItem
              key={ls.id}
              listing={ls}
              onPress={() => navigation.push("ListingDetail", { listing: ls })}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
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
  listingHeader: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});