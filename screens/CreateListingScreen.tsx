import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { CategoryEntity } from "../lib/database/category";
import { openDb } from "../lib/database/db";
import CreateRealEstateListing from "../components/CreateRealEstateListing";
import CreateVehicleListing from "../components/CreateVehicleListing";
import { AuthContext } from "../navigation/authContext";
import * as ImagePicker from "expo-image-picker";
import LocationPicker from "../components/LocationPicker";
import { getFeatureGroupsByCategoryType, getFeaturesByGroup, addListingFeatures, FeatureGroupEntity, FeatureEntity } from "../lib/database/listingFeature";
import { fetchCategoriesByParent, fetchRootCategories } from "../lib/api/category";

type NavProp = StackNavigationProp<RootStackParamList, "CreateListing">;
type Props = { navigation: NavProp };

export default function CreateListingScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Lütfen giriş yapın veya kayıt olun.</Text>
        <Button title="Ana Sayfaya Dön" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  // Category
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryEntity[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{ id: number; province: string; district: string } | null>(null);

  // Features
  const [featureGroups, setFeatureGroups] = useState<(FeatureGroupEntity & { features: (FeatureEntity & { selected: boolean })[] })[]>([]);

  useEffect(() => {
    loadCategories(-1);
  }, []);

  async function loadCategories(parentId: number) {
    const data = await fetchCategoriesByParent(parentId);
    setCategories(data);
    setLoadingCategories(false);
  }

  function handleCategoryPress(cat: CategoryEntity) {
    setSelectedCategories([...selectedCategories, cat]);
    loadCategories(cat.id);

    // Yeni kategori seçilince feature gruplarını yükle
    loadFeatureGroups(cat.category_type_id);
  }

  async function loadFeatureGroups(categoryTypeId: number) {
    const fg = await getFeatureGroupsByCategoryType(categoryTypeId);
    const withFeatures = await Promise.all(
      fg.map(async g => {
        const feats = await getFeaturesByGroup(g.id);
        return { ...g, features: feats.map(f => ({ ...f, selected: false })) };
      })
    );
    setFeatureGroups(withFeatures);
  }

  const toggleFeature = (groupIndex: number, featureIndex: number) => {
    const newGroups = [...featureGroups];
    newGroups[groupIndex].features[featureIndex].selected = !newGroups[groupIndex].features[featureIndex].selected;
    setFeatureGroups(newGroups);
  };

  const selectedCategory = selectedCategories[selectedCategories.length - 1] || null;
  const showForm = categories.length === 0 && selectedCategory;

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages(result.assets.map((a) => a.uri));
    }
  };

  const handleSubmit = async (detailData: any) => {
    if (!selectedCategory) return;
    if (!title || !price) return Alert.alert("Başlık ve fiyat gerekli!");
    if (!location) return Alert.alert("Lütfen il ve ilçe seçin!");
    if (!user?.id) return Alert.alert("Kullanıcı bilgisi alınamadı, lütfen tekrar giriş yapın.");

    try {
      const db = await openDb();
      const creationDate = Date.now();

      const listingResult: any = await db.runAsync(
        `INSERT INTO listing (title, price, category_id, desc, creation_date, location_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, parseFloat(price), selectedCategory.id, desc, creationDate, location.id, user.id]
      );

      const listingId = listingResult.insertId ?? listingResult.lastInsertRowId;
      if (!listingId) throw new Error("Listing ID alınamadı");

      for (let i = 0; i < images.length; i++) {
        await db.runAsync(
          `INSERT INTO image (listing_id, url, ui_order) VALUES (?, ?, ?)`,
          [listingId, images[i], i + 1]
        );
      }

      // Feature seçilenleri kaydet
      const selectedFeatureIds = featureGroups.flatMap(g => g.features.filter(f => f.selected).map(f => f.id));
      if (selectedFeatureIds.length > 0) {
        await addListingFeatures(listingId, selectedFeatureIds);
      }

      if (selectedCategory.category_type_id === 1) {
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
      } else if (selectedCategory.category_type_id === 2) {
        await db.runAsync(
          `INSERT INTO vehicle_detail
          (listing_id, year, fuel, transmission, kilometer, body_type, engine_cc, instrumental, color)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            listingId,
            parseInt(detailData.year),
            detailData.fuel,
            detailData.transmission,
            parseInt(detailData.kilometer),
            detailData.bodyType,
            detailData.engineCC,
            detailData.instrumental || "",
            detailData.color || "",
          ]
        );
      }

      Alert.alert("Başarılı!", "İlan oluşturuldu.");
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "İlan oluşturulurken hata oluştu!");
    }
  };

  const renderCategoryItem = ({ item }: { item: CategoryEntity }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item)} style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {!showForm ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          ListHeaderComponent={<Text style={styles.header}>Kategori Seçin</Text>}
          contentContainerStyle={{ padding: 12 }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 120 }}>
          <Text style={styles.header}>İlan Detayları</Text>

          <TextInput style={styles.input} placeholder="Başlık" placeholderTextColor="gray" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Fiyat" placeholderTextColor="gray" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
            placeholder="Açıklama"
            placeholderTextColor="gray"
            value={desc}
            onChangeText={setDesc}
            multiline
          />

          <Button title="Resim Seç" onPress={pickImages} />
          <FlatList
            horizontal
            data={images}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100, marginRight: 6, borderRadius: 8 }} />}
            style={{ marginVertical: 10 }}
          />

          <LocationPicker onSelect={setLocation} />
          {location && <Text style={{ marginVertical: 6 }}>{location.province} - {location.district}</Text>}

          {/* --- Feature Selector --- */}
          {featureGroups.map((g, gi) => (
            <View key={g.id} style={{ marginVertical: 6 }}>
              <Text style={{ fontWeight: "700" }}>{g.name}</Text>
              {g.features.map((f, fi) => (
                <View key={f.id} style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                  <Switch value={f.selected} onValueChange={() => toggleFeature(gi, fi)} />
                  <Text style={{ marginLeft: 8 }}>{f.name}</Text>
                </View>
              ))}
            </View>
          ))}

          {selectedCategory.category_type_id === 1 && <CreateRealEstateListing onSubmit={handleSubmit} />}
          {selectedCategory.category_type_id === 2 && <CreateVehicleListing onSubmit={handleSubmit} />}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", marginBottom: 10, padding: 10, borderRadius: 6, backgroundColor: "#fff" },
  categoryItem: { padding: 12, borderWidth: 1, borderColor: "#ddd", marginBottom: 6, borderRadius: 6 },
  categoryText: { fontSize: 16, fontWeight: "500" },
});
