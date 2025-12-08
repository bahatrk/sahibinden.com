import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { CategoryEntity } from "../lib/database/category";

type Props = {
  category: CategoryEntity;
  onPress: (category: CategoryEntity) => void;
};

export default function CategoryItem({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(category)}>
      {category.logo_url && (
        <Image source={{ uri: category.logo_url }} style={styles.logo} />
      )}
      <Text style={styles.text}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  text: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "400",
  },
});
