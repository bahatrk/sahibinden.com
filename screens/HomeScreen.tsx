import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import SearchBar from "../components/SearchBar";
import CategoryItem from "../components/CategoryItem";
import { CategoryEntity } from "../lib/database/category";
import { AuthContext } from "../navigation/authContext";
import { deleteCategory, fetchRootCategories, restoreCategory } from "../lib/api/category";
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

  const isAdmin = user?.role === "admin";

  function handleSearch() {
    if (search.trim().length >= 2) {
      // Navigate to SearchResults screen passing the query
      navigation.navigate("SearchResults", { query: search });
      setSearch(""); // Optional: Clear search bar after searching
    } else {
        Alert.alert("Uyarı", "Lütfen en az 2 karakter giriniz.");
    }
  }

  useEffect(() => {
    loadRootCategories();
  }, []);

  useEffect(() => {
    loadRootCategories();
  }, [user]); // <--- Reload if user changes (login/logout)

  async function loadRootCategories() {
    // 3. Pass the flag
    const data = await fetchRootCategories(isAdmin);
    setCategories(data);
  }

  function handleCategoryPress(cat: CategoryEntity) {
    navigation.navigate("Category", cat);
  }

  function handleLongPress(cat: CategoryEntity) {
  // 1. Security Check
  if (user?.role !== "admin") return;

  const isActive = cat.is_active !== false;

  // 2. Define Messages based on Status
  const title = isActive ? "Kategoriyi Sil (Pasif)" : "Kategoriyi Geri Yükle (Aktif)";
  const message = isActive 
      ? `"${cat.name}" kategorisini pasife almak istediğine emin misin? Kullanıcılar artık göremeyecek.` 
      : `"${cat.name}" kategorisini tekrar aktif etmek istediğine emin misin?`;

  const actionText = isActive ? "Sil (Pasif)" : "Geri Yükle";
  const actionStyle = isActive ? "destructive" : "default";

  // 3. Show Alert
  Alert.alert(
    title,
    message,
    [
      { text: "İptal", style: "cancel" },
      { 
        text: actionText, 
        style: actionStyle, 
        onPress: async () => {
           // 4. Toggle Logic
           let res;
           if (isActive) {
               res = await deleteCategory(cat.id);
           } else {
               res = await restoreCategory(cat.id);
           }

           if (res.success) {
             // 5. Refresh List
             // Make sure this function fetches BOTH active and passive for admins
             loadRootCategories(); 
           } else {
             Alert.alert("Hata", res.message || "İşlem başarısız.");
           }
        } 
      }
    ]
  );
}

  return (
    <View style={styles.container}>
      <SearchBar 
         value={search} 
         onChangeText={setSearch} 
         onSearch={handleSearch} // <--- Pass the function here
         placeholder="Araba, ev ara..." 
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryItem 
          category={item} 
          onPress={handleCategoryPress}
          onLongPress={handleLongPress} />
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