import React, { useState, useContext, useEffect } from "react";
import {
  View, Text, TextInput, Button, ScrollView, Image, Alert, Switch, StyleSheet, ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../navigation/authContext";

import { uploadListingImages } from "../../lib/api/listing"; 
import UniversalMap, { MapLocationResult } from "../map/MapComponent";
import UpdateRealEstateDetail from "./UpdateRealEstateDetail";
import UpdateVehicleDetail from "./UpdateVehicleDetail";
import { updateRealEstateListing } from "../../lib/api/realEstate";
import { updateVehicleListing } from "../../lib/api/vehicle";

// --- NEW IMPORTS FOR FEATURES ---
import { 
  getFeatureGroupsByCategoryTypeApi, 
  getFeaturesByGroupApi, 
  getListingFeaturesApi // You need this API to know what the listing currently has
} from "../../lib/api/listingFeature";
import { FeatureEntity, FeatureGroupEntity } from "../../lib/database/listingFeature";

type Props = {
  listing: any;
  navigation: any;
};

export default function UpdateListingForm({ listing, navigation }: Props) {
  const { user } = useContext(AuthContext);

  // 1. Basic Form State
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price.toString());
  const [desc, setDesc] = useState(listing.desc);
  
  // Images
  const [existingImages, setExistingImages] = useState<any[]>(listing.images || []);
  const [newImages, setNewImages] = useState<string[]>([]);
  
  // Location
  const [mapLocation, setLocation] = useState<MapLocationResult>();
  
  // Initial Location Object for Map
  const initialMapLocation = {
    city_id: listing.location?.city_id,
    district_id: listing.location?.district_id,
    neighbourhood_id: listing.location?.neighbourhood_id,
    lat: listing.location?.lat,
    lon: listing.location?.lon
  };

  // --- 2. FEATURES STATE ---
  const [featureGroups, setFeatureGroups] = useState<(FeatureGroupEntity & { features: (FeatureEntity & { selected: boolean })[] })[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  // --- 3. LOAD & MERGE FEATURES ON MOUNT ---
  useEffect(() => {
    loadFeaturesForUpdate();
  }, []);

  async function loadFeaturesForUpdate() {
    try {
      setLoadingFeatures(true);

      // A. Get All Possible Feature Groups (The Template)
      const allGroups = await getFeatureGroupsByCategoryTypeApi(listing.category_type_id);
      
      // B. Get The Listing's Current Features (The Data)
      // Assuming getListingFeaturesApi returns [{ group:..., features: [...] }]
      const currentListingFeatures = await getListingFeaturesApi(listing.id);
      
      // Create a Set of IDs that are currently active on this listing for fast lookup
      const activeFeatureIds = new Set<number>();
      currentListingFeatures.forEach((group: any) => {
        group.features.forEach((feat: any) => activeFeatureIds.add(feat.id));
      });

      // C. Merge: Build the list and mark 'selected' if ID is in activeFeatureIds
      const mergedGroups = await Promise.all(
        allGroups.map(async (g) => {
          const groupFeatures = await getFeaturesByGroupApi(g.id);
          return { 
            ...g, 
            features: groupFeatures.map((f) => ({ 
              ...f, 
              // THIS IS THE KEY LOGIC:
              selected: activeFeatureIds.has(f.id) 
            })) 
          };
        })
      );

      setFeatureGroups(mergedGroups);
    } catch (e) {
      console.log("Error loading features", e);
      Alert.alert("Error", "Could not load features.");
    } finally {
      setLoadingFeatures(false);
    }
  }

  // --- 4. TOGGLE LOGIC (Same as Create Form) ---
  const toggleFeature = (gIndex: number, fIndex: number) => {
    const newGroups = [...featureGroups];
    newGroups[gIndex].features[fIndex].selected = !newGroups[gIndex].features[fIndex].selected;
    setFeatureGroups(newGroups);
  };

  // --- 5. SUBMIT LOGIC ---
  const handleUpdate = async (detailData: any) => {
    if (!user) return;
    try {
      // Collect IDs of features that are currently true
      const selectedFeatureIds = featureGroups.flatMap((g) =>
        g.features.filter((f) => f.selected).map((f) => f.id)
      );

      const payload = {
        id: listing.id,
        title,
        price: parseFloat(price),
        desc,
        category_id: listing.category_id,
        user_id: user.id,
        location: {
           lat: mapLocation?.coor.lat ?? listing.location?.lat,
           lon: mapLocation?.coor.lon ?? listing.location?.lon,
           neighbourhood_id: mapLocation?.location.neighbourhoodId ?? listing.location?.neighbourhood_id
        },
        // Send the updated list of features
        feature_ids: selectedFeatureIds, 
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

      Alert.alert("Success", "The listing has been updated.");
      navigation.goBack();
      
    } catch (error: any) {
      console.error(error);
      Alert.alert("Mistake", "Update failed.");
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
      <Text style={styles.header}>Edit Listing</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Price"
      />
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        value={desc}
        onChangeText={setDesc}
        multiline
        placeholder="Description"
      />

      {/* Images Area */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
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
      <Button title="Add New Image" onPress={pickImages} />

      {/* Location */}
      <View style={{ marginVertical: 15 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Location</Text>
        <UniversalMap
            mode="edit"
            initialLocation={initialMapLocation}
            onLocationSelect={(loc) => {
            setLocation(loc);
            console.log("Selected location:", loc);
            }}
        />
      </View>

      {/* --- FEATURES SECTION --- */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>Features</Text>
      
      {loadingFeatures ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        featureGroups.map((g, gi) => (
            <View key={g.id} style={{ marginVertical: 5 }}>
              <Text style={{ fontWeight: "bold", color: "#444" }}>{g.name}</Text>
              {g.features.map((f, fi) => (
                <View key={f.id} style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                  <Switch value={f.selected} onValueChange={() => toggleFeature(gi, fi)} />
                  <Text style={{ marginLeft: 10 }}>{f.name}</Text>
                </View>
              ))}
            </View>
          ))
      )}
      
      <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 15 }} />

      {/* Specific Details Forms */}
      {listing.category_type_id === 1 && (
        <UpdateRealEstateDetail
          initialData={listing}
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