import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { CategoryEntity } from "../lib/database/category";

type Props = {
  category: CategoryEntity;
  onPress: (category: CategoryEntity) => void;
};

export default function CategoryItem({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(category)}>
      <Entypo name="chevron-right" size={20} color="gray" />
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
  text: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "400",
  },
});
 