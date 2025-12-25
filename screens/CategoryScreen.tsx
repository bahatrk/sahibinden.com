import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/types";


import {
  CategoryEntity,
} from "../lib/database/category";
import {
  ListingWithData,
} from "../lib/database/listing";
import ListingItem from "../components/ListingItem";
import CategoryItem from "../components/CategoryItem";
import { fetchCategoriesByParent } from "../lib/api/category";
import { fetchListingByCategory } from "../lib/api/listing";

type NavProp = StackNavigationProp<RootStackParamList, "Category">;
type RouteProps = RouteProp<RootStackParamList, "Category">;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function CategoryScreen({ navigation, route }: Props) {
  const category = route.params; // because we passed {cat}

  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [listings, setListings] = useState<ListingWithData[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const childCats = await fetchCategoriesByParent(category.id);

    if (childCats.length > 0) {
      setCategories(childCats);
      setListings([]);
    } else {
      const items = await fetchListingByCategory(category.id);
      setListings(items);
    }

  }

  function handlePress(cat: CategoryEntity) {
    navigation.push("Category", cat );
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
  listingHeader: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});