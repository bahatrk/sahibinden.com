import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { getChildCategories, CategoryEntity } from "../lib/database/category";
import CategoryItem from "../components/CategoryItem";
import CreateRealEstateListing from "../components/CreateRealEstateListing";
import CreateVehicleListing from "../components/CreateVehicleListing";
import { AuthContext } from "../navigation/authContext";
import { openDb } from "../lib/database/db";

type NavProp = StackNavigationProp<RootStackParamList, "CreateListing">;

type Props = {
  navigation: NavProp;
};

export default function CreateListingScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryEntity[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // kategori yükleme
  React.useEffect(() => {
    loadCategories(null);
  }, []);

  async function loadCategories(parentId: number | null) {
    const data = await getChildCategories(parentId);
    setCategories(data);
    setLoadingCategories(false);
  }

  function handleCategoryPress(cat: CategoryEntity) {
    setSelectedCategories([...selectedCategories, cat]);
    loadCategories(cat.id);
  }

  const selectedCategory =
    selectedCategories[selectedCategories.length - 1] || null;

  const showForm = categories.length === 0 && selectedCategory;

  const handleSubmit = async (detailData: any) => {
    try {
      const db = await openDb();
      const creationDate = Date.now();

      const result: any = await db.runAsync(
        `INSERT INTO listing (title, price, category_id, desc, creation_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, parseFloat(price), selectedCategory?.id, "", creationDate, user.id]
      );

      const listingId = result.insertId;

      if (selectedCategory?.category_type_id === 1) {
        // Emlak
        await db.runAsync(
          `INSERT INTO real_estate_detail
          (listing_id, room_number, bathroom_number, square_meter, floor, building_age, furnished)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            listingId,
            parseInt(detailData.roomNumber),
            parseInt(detailData.bathroomNumber),
            parseInt(detailData.squareMeter),
            parseInt(detailData.floor),
            parseInt(detailData.buildingAge),
            detailData.furnished ? 1 : 0,
          ]
        );
      } else if (selectedCategory?.category_type_id === 2) {
        // Araç
        await db.runAsync(
          `INSERT INTO vehicle_detail
          (listing_id, year, fuel, transmission, kilometer, body_type, engine_cc)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            listingId,
            parseInt(detailData.year),
            detailData.fuel,
            detailData.transmission,
            parseInt(detailData.kilometer),
            detailData.bodyType,
            detailData.engineCC,
          ]
        );
      }

      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {!showForm && (
        <>
          <Text style={styles.header}>Kategori Seçin</Text>
          {loadingCategories ? (
            <Text>Yükleniyor...</Text>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CategoryItem category={item} onPress={handleCategoryPress} />
              )}
            />
          )}
        </>
      )}

      {showForm && (
        <View>
          <Text style={styles.header}>İlan Detayları</Text>
          <TextInput
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Fiyat"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {selectedCategory.category_type_id === 1 && (
            <CreateRealEstateListing onSubmit={handleSubmit} />
          )}
          {selectedCategory.category_type_id === 2 && (
            <CreateVehicleListing onSubmit={handleSubmit} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
});
