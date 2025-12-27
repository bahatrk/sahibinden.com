import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  onPress?: () => void;
};

export default function UserInfoCard({ name, surname, email, phone, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.sectionTitle}>User Information</Text>
      <Text>Name: {name}</Text>
      <Text>Surname: {surname}</Text>
      <Text>Email: {email}</Text>
      <Text>Phone: {phone || "-"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
});
