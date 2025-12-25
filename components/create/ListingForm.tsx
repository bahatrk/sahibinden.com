import React, { useState, useEffect, useContext } from "react";
import {
  View, Text, TextInput, Button, ScrollView, Image, Alert, Switch, StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// Context & API


// Components
import CreateRealEstateListing from "./CreateRealEstateListing";
import CreateVehicleListing from "./CreateVehicleListing";
import { CategoryEntity } from "../../lib/database/category";
import { AuthContext } from "../../navigation/authContext";
import { FeatureEntity, FeatureGroupEntity } from "../../lib/database/listingFeature";
import { getFeatureGroupsByCategoryTypeApi, getFeaturesByGroupApi } from "../../lib/api/listingFeature";
import { createRealEstateListing } from "../../lib/api/realEstate";
import { createVehicleListing } from "../../lib/api/vehicle";
import { uploadListingImages } from "../../lib/api/listing";
import MapLocationPicker, { MapLocationResult } from "../MapLocationPicker";

type Props = {
  category: CategoryEntity;
  navigation: any;
  onCancel: () => void; // Kategori değiştirmek isterse
};

export default function ListingForm({ category, navigation, onCancel }: Props) {
  const { user } = useContext(AuthContext);
  
  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [mapLocation, setLocation] = useState<MapLocationResult>();
  
  // Features State
  const [featureGroups, setFeatureGroups] = useState<(FeatureGroupEntity & { features: (FeatureEntity & { selected: boolean })[] })[]>([]);

  // Kategori değiştiğinde veya component yüklendiğinde özellik gruarını çek
  useEffect(() => {
    // Eğer kategori ID'si yoksa veya değişmediyse çalışma
  if (!category?.id) return;

  loadFeatureGroups(category.category_type_id);
  }, [category.id]);

  async function loadFeatureGroups(typeId: number) {
    try {
      const fg = await getFeatureGroupsByCategoryTypeApi(typeId);
      const withFeatures = await Promise.all(
        fg.map(async (g) => {
          const feats = await getFeaturesByGroupApi(g.id);
          return { ...g, features: feats.map((f) => ({ ...f, selected: false })) };
        })
      );
      setFeatureGroups(withFeatures);
    } catch (e) {
      console.log("Features Error", e);
    }
  }

  const toggleFeature = (gIndex: number, fIndex: number) => {
    const newGroups = [...featureGroups];
    newGroups[gIndex].features[fIndex].selected = !newGroups[gIndex].features[fIndex].selected;
    setFeatureGroups(newGroups);
  };

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsMultipleSelection: true, quality: 0.7,
    });
    if (!res.canceled) setImages(res.assets.map((a) => a.uri));
  };

  const handleSubmit = async (detailData: any) => {
    if (!title || !price) return Alert.alert("Hata", "Başlık ve Fiyat zorunludur.");
    if (!mapLocation) return Alert.alert("Hata", "Konum seçmelisiniz.");
    if (!user) return;
    try {
      const selectedFeatureIds = featureGroups.flatMap((g) =>
        g.features.filter((f) => f.selected).map((f) => f.id)
      );

      const payload: any = {
        title,
        price: parseFloat(price),
        desc,
        category_id: category.id,
        location: {
            lat: mapLocation.coor.lat,
            lon: mapLocation.coor.lon,
            neighbourhood_id: mapLocation.location.neighbourhoodId
        },
        user_id: user.id,
        feature_ids: selectedFeatureIds,
        ...detailData
      };
      console.log(payload)
      

      // API Çağrısı
      let result;
      if (category.category_type_id === 1) result = await createRealEstateListing(payload);
      else result = await createVehicleListing(payload);

      // Resim Yükleme
      await uploadListingImages(result.id, images);

      Alert.alert("Başarılı", "İlan oluşturuldu.");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Hata", error.response?.data?.detail || "Bir hata oluştu");
    } finally {
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
      nestedScrollEnabled={true} // LocationPicker içindeki scroll hatasını önler
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.header}>İlan Detayları: {category.name}</Text>
        <Button title="Değiştir" onPress={onCancel} color="red" />
      </View>

      <TextInput style={styles.input} placeholder="Başlık" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Fiyat" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput style={[styles.input, { minHeight: 80 }]} placeholder="Açıklama" multiline value={desc} onChangeText={setDesc} />

      <Button title="Resim Ekle" onPress={pickImages} />
      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={{ width: 80, height: 80, marginRight: 5, borderRadius: 5 }} />
        ))}
      </ScrollView>

      {/* LocationPicker */}
      <MapLocationPicker
        onLocationSelect={(loc) => {
            setLocation(loc); // now includes lat/lng
            console.log("Selected location:", loc);
        }}
        />

      {/* Özellikler (Features) */}
      {featureGroups.map((g, gi) => (
        <View key={g.id} style={{ marginVertical: 5 }}>
          <Text style={{ fontWeight: "bold" }}>{g.name}</Text>
          {g.features.map((f, fi) => (
            <View key={f.id} style={{ flexDirection: "row", alignItems: "center" }}>
              <Switch value={f.selected} onValueChange={() => toggleFeature(gi, fi)} />
              <Text style={{ marginLeft: 10 }}>{f.name}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Dinamik Alt Formlar */}
      {category.category_type_id === 1 && <CreateRealEstateListing onSubmit={handleSubmit} />}
      {category.category_type_id === 2 && <CreateVehicleListing onSubmit={handleSubmit} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" }
});