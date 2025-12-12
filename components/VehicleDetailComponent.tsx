import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView,Image } from "react-native";
import { VehicleDetailEntity } from "../lib/database/vehicleDetail";
import { getListingImages, ImageEntity } from "../lib/database/image";

type Props = {
  detail: VehicleDetailEntity;
};

export default function VehicleDetailComponent({ detail }: Props) {
    const [images, setImages] = useState<ImageEntity[]>([]);

    useEffect(() => {
      loadImages();
    }, []);

    async function loadImages() {
      const imgs = await getListingImages(detail.listing_id);
      setImages(imgs);
    }

  const rows = [
    { label: "Marka", value: detail.brand_name },
    { label: "Model", value: detail.model_name },
    { label: "Seri", value: detail.serial_name },
    { label: "Yıl", value: detail.year },
    { label: "Yakıt", value: detail.fuel },
    { label: "Vites", value: detail.transmission },
    { label: "KM", value: detail.kilometer },
    { label: "Kasa Tipi", value: detail.body_type },
    { label: "Motor Hacmi", value: detail.engine_cc },
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
    marginBottom: 12 
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
