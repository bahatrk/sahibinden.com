import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { CategoryEntity } from "../lib/database/category";
import { ListingWithData } from "../lib/database/listing";
import ListingItem from "../components/ListingItem";
import CategoryItem from "../components/CategoryItem";
import { fetchCategoriesByParent } from "../lib/api/category";
import { fetchListingByCategory } from "../lib/api/listing";
import { AuthContext } from "../navigation/authContext"; // <--- IMPORT
import Feather from "@expo/vector-icons/Feather";
import AddCategoryModal from "../components/admin/AddCategoryModal";

type NavProp = StackNavigationProp<RootStackParamList, "Category">;
type RouteProps = RouteProp<RootStackParamList, "Category">;

type Props = {
  navigation: NavProp;
  route: RouteProps;
};

export default function CategoryScreen({ navigation, route }: Props) {
  const category = route.params; 
  const { user } = useContext(AuthContext); // <--- Get User

  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [listings, setListings] = useState<ListingWithData[]>([]);
  const [isModalVisible, setModalVisible] = useState(false); // <--- Modal State

  const isAdmin = user?.role === "admin"; // <--- Check Role

  useEffect(() => {
    load();
  }, [user]); // Reload if auth state changes

  async function load() {
    // Reload logic
    const childCats = await fetchCategoriesByParent(category.id, isAdmin);
    if (childCats.length > 0) {
      setCategories(childCats);
      setListings([]);
    } else {
      // Logic: Only fetch listings if no categories exist yet? 
      // Or maybe fetch both. For now, keeping your logic.
      setCategories([]); 
      const items = await fetchListingByCategory(category.id);
      setListings(items);
    }
  }

  function handlePress(cat: CategoryEntity) {
    navigation.push("Category", cat);
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

      {/* --- ADMIN ADD SUB-CATEGORY BUTTON --- */}
      {/* Only show if we are NOT showing listings (optional logic depending on your UX) */}
      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.adminAddButton}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* --- MODAL --- */}
      <AddCategoryModal
        visible={isModalVisible}
        parentId={category.id} // <--- Pass CURRENT category ID as parent
        onClose={() => setModalVisible(false)}
        onSuccess={load} // Refresh this screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
  // ... existing styles ...
  
  adminAddButton: {
    position: "absolute", bottom: 40, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#E63946", 
    justifyContent: "center", alignItems: "center",
    elevation: 5
  }
});