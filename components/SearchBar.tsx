import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Arama..."}
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  icon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  input: {
    height: "100%",
    paddingLeft: 40,
    fontSize: 16,
  },
});
 