import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from "react-native";
import { RealEstateDetailEntity } from "../lib/database/realEstateDetail";
import { getListingImages, ImageEntity } from "../lib/database/image";

type Props = {
  detail: RealEstateDetailEntity;
};

export default function RealEstateDetailComponent({ detail }: Props) {
  const [images, setImages] = useState<ImageEntity[]>([]);

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
      {/* Resimler */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageScroll: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 0,
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
