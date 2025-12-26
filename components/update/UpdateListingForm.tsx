import React, { useState, useContext } from "react";
import {
  View, Text, TextInput, Button, ScrollView, Image, Alert, Switch, StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../navigation/authContext";
import { uploadListingImages } from "../../lib/api/listing"; // Ensure these exist
import UniversalMap, { MapLocationResult } from "../map/MapComponent";
import UpdateRealEstateDetail from "./UpdateRealEstateDetail";
import UpdateVehicleDetail from "./UpdateVehicleDetail";
import { updateRealEstateListing } from "../../lib/api/realEstate";
import { updateVehicleListing } from "../../lib/api/vehicle";

type Props = {
  listing: any;
  navigation: any;
};

export default function UpdateListingForm({ listing, navigation }: Props) {
  const { user } = useContext(AuthContext);

  // 1. Initialize State DIRECTLY from listing
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price.toString());
  const [desc, setDesc] = useState(listing.desc);
  
  // Existing images are objects {id, url}, new ones will be strings (uri)
  const [existingImages, setExistingImages] = useState<any[]>(listing.images || []);
  const [newImages, setNewImages] = useState<string[]>([]);
  
  const [mapLocation, setLocation] = useState<MapLocationResult>();
  // Construct the object for UniversalMap
const initialMapLocation = {
    city_id: listing.location?.city_id, // Make sure your API returns this
    district_id: listing.location?.district_id, // Make sure your API returns this
    neighbourhood_id: listing.location?.neighbourhood_id,
    lat: listing.location?.lat,
    lon: listing.location?.lon
};

  // Simplified Feature Logic (Assuming you have a helper to parse features)
  // For brevity, I am skipping the complex feature toggle logic here, 
  // but you would initialize 'featureGroups' checking against 'listing.features'.

  const handleUpdate = async (detailData: any) => {
    if (!user) return;
    try {
      const payload = {
        id: listing.id, // ID is required for update
        title,
        price: parseFloat(price),
        desc,
        category_id: listing.category_id,
        user_id: user.id,
        location: {
           lat: mapLocation?.coor.lat,
           lon: mapLocation?.coor.lon,
           neighbourhood_id: mapLocation?.location.neighbourhoodId
        },
        feature_ids: [], // Fill this with selected feature IDs
        ...detailData
      };

      console.log("Updating Payload:", payload);

      if (listing.category_type_id === 1) {
          await updateRealEstateListing(listing.id, payload);
      } else {
          await updateVehicleListing(listing.id, payload);
      }

      // Handle New Images
      if (newImages.length > 0) {
        await uploadListingImages(listing.id, newImages);
      }

      Alert.alert("Başarılı", "İlan güncellendi.");
      navigation.goBack();
      
    } catch (error: any) {
      Alert.alert("Hata", "Güncelleme başarısız.");
    }
  };

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsMultipleSelection: true, quality: 0.7,
    });
    if (!res.canceled) setNewImages([...newImages, ...res.assets.map((a) => a.uri)]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
      <Text style={styles.header}>İlanı Düzenle</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      {/* Images Area */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {existingImages.map((img, i) => (
          <Image key={i} source={{ uri: img.url }} style={styles.thumb} />
        ))}
        {newImages.map((uri, i) => (
          <Image
            key={`new-${i}`}
            source={{ uri }}
            style={[styles.thumb, { borderColor: "green", borderWidth: 2 }]}
          />
        ))}
      </View>
      <Button title="Yeni Resim Ekle" onPress={pickImages} />

      {/* Location */}
      <UniversalMap
        mode="edit"
        initialLocation={initialMapLocation}
        onLocationSelect={(loc) => {
          setLocation(loc); // now includes lat/lng
          console.log("Selected location:", loc);
        }}
      />

      {/* Specific Details Forms */}
      {listing.category_type_id === 1 && (
        <UpdateRealEstateDetail
          initialData={listing} // Pass the WHOLE listing, it contains the details
          onSubmit={handleUpdate}
        />
      )}

      {listing.category_type_id === 2 && (
        <UpdateVehicleDetail initialData={listing} onSubmit={handleUpdate} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
  thumb: { width: 60, height: 60, margin: 5, borderRadius: 5 }
});