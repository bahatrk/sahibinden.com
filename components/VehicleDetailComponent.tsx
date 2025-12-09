import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VehicleDetailEntity } from "../lib/database/vehicleDetail";

type Props = {
  detail: VehicleDetailEntity;
};

export default function RealEstateDetailComponent({ detail }: Props) {
  const rows = [
    { label: "Yıl", value: detail.year },
    { label: "Yakıt", value: detail.fuel },
    { label: "Vites", value: detail.transmission},
    { label: "KM", value: detail.kilometer },
    { label: "Kasa Tipi", value: detail.body_type},
    { label: "Motor Hacmi", value: detail.engine_cc},
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
