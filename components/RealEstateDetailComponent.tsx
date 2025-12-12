import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from "react-native";
import { RealEstateDetailEntity } from "../lib/database/realEstateDetail";
import { getListingImages, ImageEntity } from "../lib/database/image";

type Props = {
  detail: RealEstateDetailEntity;
};

export default function RealEstateDetailComponent({ detail }: Props) {
  const [images, setImages] = useState<ImageEntity[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "description">("info");

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const imgs = await getListingImages(detail.listing_id);
    setImages(imgs);
  }

  const rows = [
    { label: "Oda Sayısı", value: detail.room_number },
    { label: "Banyo Sayısı", value: detail.bathroom_number },
    { label: "Metrekare", value: `${detail.square_meter} m²` },
    { label: "Kat", value: detail.floor },
    { label: "Bina Yaşı", value: `${detail.building_age} yıl` },
    { label: "Eşyalı", value: detail.furnished ? "Evet" : "Hayır" },
  ];

  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* --- RESİMLER --- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {images.map((img) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={{
              width: windowWidth * 0.8,
              height: 220,
              borderRadius: 10,
              marginRight: 12,
            }}
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
          <Text style={[styles.tabText, activeTab === "info" && styles.tabTextActive]}>
            İlan Bilgileri
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "description" && styles.tabActive]}
          onPress={() => setActiveTab("description")}
        >
          <Text style={[styles.tabText, activeTab === "description" && styles.tabTextActive]}>
            Açıklama
          </Text>
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
        </View>
      ) : (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 14, lineHeight: 20 }}>
            {detail.desc ?? "Açıklama bulunamadı."}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageScroll: {
    marginBottom: 12,
  },

  /* --- TAB STYLES --- */
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#104E8B",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },

  /* --- ROWS --- */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  label: {
    color: "#555",
    fontSize: 14,
  },
  value: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});
