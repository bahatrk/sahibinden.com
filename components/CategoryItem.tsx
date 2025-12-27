import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { CategoryEntity } from "../lib/database/category";
import Feather from "@expo/vector-icons/Feather";
import { getLogoImageUrl } from "../constant/apiConfig";

type Props = {
  category: CategoryEntity;
  onPress: (category: CategoryEntity) => void;
  onLongPress?: (category: CategoryEntity) => void;
};

export default function CategoryItem({ category, onPress, onLongPress }: Props) {
  // Check if category is active (default true if undefined)
  const isActive = category.is_active !== false; 

  return (
    <TouchableOpacity
      style={[styles.item, !isActive && styles.passiveItem]} // Add style if passive
      onPress={() => onPress(category)}
      onLongPress={() => onLongPress && onLongPress(category)}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      {/* Logo */}
      {category.logo_url && (
        <Image source={{
          uri: getLogoImageUrl(category.logo_url),
        }} style={[styles.logo, !isActive && { opacity: 0.5 }]} />
        
      )}

      {/* Text Info */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, !isActive && styles.passiveText]}>
            {category.name}
        </Text>
        
        {/* Helper Badge for Admins */}
        {!isActive && (
            <View style={styles.badgeContainer}>
                <Feather name="eye-off" size={12} color="white" />
                <Text style={styles.badgeText}>PASSIVE</Text>
            </View>
        )}
      </View>
      
      {/* Arrow Icon */}
      <Feather name="chevron-right" size={20} color={isActive ? "#ccc" : "#e57373"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  passiveItem: {
    backgroundColor: "#fff0f0", // Light red background for deleted items
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 8,
  },
  placeholderLogo: {
    width: 40, height: 40,
    backgroundColor:'#f5f5f5', borderRadius:8,
    alignItems:'center', justifyContent:'center'
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row", // Align text and badge horizontally
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
    color: "#333",
  },
  passiveText: {
    color: "#a0a0a0", // Gray text
    textDecorationLine: 'line-through' // Strikethrough
  },
  badgeContainer: {
    marginLeft: 10,
    backgroundColor: "#e57373", // Red badge
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  }
});