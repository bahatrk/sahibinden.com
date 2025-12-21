import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from "react-native";
import { getListingFeatures, FeatureGroupEntity, FeatureEntity } from "../lib/database/listingFeature";
import { RealEstateWithImagesOut } from "../lib/database/realEstateDetail";

type Props = {
  detail: RealEstateWithImagesOut;
};

export default function RealEstateDetailComponent({ detail }: Props) {
  const images = detail.images ?? [];
  const [activeTab, setActiveTab] = useState<"info" | "description">("info");
  const [listingFeatures, setListingFeatures] = useState<{ group: FeatureGroupEntity; features: FeatureEntity[] }[]>([]);

  useEffect(() => {
    //loadImages();
    loadFeatures();
  }, []);

  // async function loadImages() {
  //   const imgs = await getListingImages(detail.listing_id);
  //   setImages(imgs);
  // }

  async function loadFeatures() {
    const feats = await getListingFeatures(detail.listing_id);
    setListingFeatures(feats);
  }

  const rows = [
    {label: "Fiyat", value: `${detail.price} TL`},
    {label: "İlan Tarihi", value: detail.creation_date},
    { label: "Metrekare", value: `${detail.square_meter} m²` },
    { label: "Oda Sayısı", value: detail.room_number },
    { label: "Bina Yaşı", value: `${detail.building_age} yıl` },
    { label: "Bulunduğu Kat", value: detail.floor },
    { label: "Banyo Sayısı", value: detail.bathroom_number },
    { label: "Mutfak", value: detail.kitchen },
    { label: "Asansör", value: detail.lift ? "Var" : "Yok" },
    { label: "Otopark", value: detail.car_park ? "Açık & Kapalı Otopark" : "Yok" },
    { label: "Eşyalı", value: detail.furnished ? "Evet" : "Hayır" },
  ];

  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* --- RESİMLER --- */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {images.map((img) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={{ width: windowWidth * 0.8, height: 220, marginRight: 12 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* --- TAB MENU --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "info" && styles.tabActive]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.tabText, activeTab === "info" && styles.tabTextActive]}>İlan Bilgileri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "description" && styles.tabActive]}
          onPress={() => setActiveTab("description")}
        >
          <Text style={[styles.tabText, activeTab === "description" && styles.tabTextActive]}>Açıklama</Text>
        </TouchableOpacity>
      </View>

      {/* --- TAB CONTENT --- */}
      {activeTab === "info" ? (
        <View>
          {rows.map((row, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.label}>{row.label}</Text>
                <Text style={styles.value}>{row.value}</Text>
              </View>
              {index < rows.length - 1 && <View style={styles.separator} />}
            </View>
          ))}

          {/* --- FEATURES --- */}
          {listingFeatures.map((g) => (
            <View key={g.group.id} style={{ marginVertical: 8 }}>
              <Text style={{ fontWeight: "700" }}>{g.group.name}</Text>
              {g.features.map((f) => (
                <Text key={f.id}>• {f.name}</Text>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 14, lineHeight: 20 }}>{detail.listing_desc ?? "Açıklama bulunamadı."}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  imageScroll: { marginBottom: 12 },
  tabContainer: { flexDirection: "row", backgroundColor: "#f0f0f0", borderRadius: 10, overflow: "hidden", marginBottom: 12 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#104E8B" },
  tabText: { fontSize: 14, color: "#555", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  label: { color: "#555", fontSize: 14 },
  value: { color: "#000", fontSize: 14, fontWeight: "500" },
  separator: { height: 1, backgroundColor: "#e0e0e0" },
});
