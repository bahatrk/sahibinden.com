import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import SearchBar from "../components/SearchBar";
import CategoryItem from "../components/CategoryItem";
import { CategoryEntity } from "../lib/database/category";
import { AuthContext } from "../navigation/authContext";
import { fetchRootCategories } from "../lib/api/category";
import Feather from "@expo/vector-icons/Feather"; // <--- For icons
import AddCategoryModal from "../components/admin/AddCategoryModal";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type Props = { navigation: HomeScreenNavigationProp; };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const { user } = useContext(AuthContext);
  
  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadRootCategories();
  }, []);

  async function loadRootCategories() {
    const data = await fetchRootCategories();
    setCategories(data);
  }

  function handleCategoryPress(cat: CategoryEntity) {
    navigation.navigate("Category", cat);
  }

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Araba, ev ara..." />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryItem category={item} onPress={handleCategoryPress} />
        )}
      />

      {/* --- ADMIN ADD BUTTON (Left Side) --- */}
      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.adminAddButton}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* --- EXISTING: ILAN VER BUTTON (Right Side) --- */}
      <TouchableOpacity
        style={styles.handleIlanVerButton}
        onPress={() => {
          if (!user) navigation.navigate("Login");
          else navigation.navigate("CreateListing");
        }}
      >
         <Text style={styles.handleIlanVerText}>+</Text>
      </TouchableOpacity>

      {/* --- MODAL --- */}
      <AddCategoryModal 
        visible={isModalVisible}
        parentId={null} // Root category has no parent
        onClose={() => setModalVisible(false)}
        onSuccess={loadRootCategories} // Reload list after adding
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  
  // Existing Button (Right)
  handleIlanVerButton: {
    position: "absolute", bottom: 40, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#2E5894", justifyContent: "center", alignItems: "center",
    elevation: 5
  },
  handleIlanVerText: { fontSize: 30, color: "white" },

  // New Admin Button (Left)
  adminAddButton: {
    position: "absolute", bottom: 40, left: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#E63946", // Different color for Admin
    justifyContent: "center", alignItems: "center",
    elevation: 5
  }
});