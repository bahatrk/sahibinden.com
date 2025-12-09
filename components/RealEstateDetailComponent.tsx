import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RealEstateDetailEntity } from "../lib/database/realEstateDetail";

type Props = {
  detail: RealEstateDetailEntity;
};

export default function RealEstateDetailComponent({ detail }: Props) {
  const rows = [
    { label: "Oda Sayısı", value: detail.room_number },
    { label: "Banyo Sayısı", value: detail.bathroom_number },
    { label: "Metrekare", value: `${detail.square_meter} m²` },
    { label: "Kat", value: detail.floor },
    { label: "Bina Yaşı", value: `${detail.building_age} yıl` },
    { label: "Eşyalı", value: detail.furnished ? "Evet" : "Hayır" },
  ];

  return (
    <View style={styles.container}>
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
