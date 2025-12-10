import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import SearchBar from "../components/SearchBar";
import CategoryItem from "../components/CategoryItem";
import { getChildCategories, CategoryEntity } from "../lib/database/category";

import { AuthContext } from "../navigation/authContext";
import { useContext } from "react";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadRootCategories();
  }, []);

  async function loadRootCategories() {
    const data = await getChildCategories(null);
    setCategories(data);
  }

  function handleCategoryPress(cat: CategoryEntity) {
    navigation.navigate("Category", cat);
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Araba, ev ara..."
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryItem category={item} onPress={handleCategoryPress} />
        )}
      />

      {/* İlan Ver Button */}
      <TouchableOpacity
        style={styles.handleIlanVerButton}
        onPress={() => {
          if (!user) {
            navigation.navigate("Login");
          } else {
            navigation.navigate("CreateListing"); // sonra ilan ekleme ekranı gelecek
          }
        }}
      >
        <Text style={styles.handleIlanVerText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  handleIlanVerButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#2E5894",
    justifyContent: "center",
    alignItems: "center",
  },

  handleIlanVerText: {
    fontSize: 30,
    color: "white",
  },
});
 