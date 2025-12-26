import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void; // <--- New Prop to trigger search
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, onSearch, placeholder }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Arama..."}
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"    // <--- Change Keyboard Enter Key to "Search"
        onSubmitEditing={onSearch} // <--- Trigger action when Enter is pressed
      />
      
      {/* Optional: Clear Button */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearBtn}>
             <Ionicons name="close-circle" size={18} color="#ccc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 45,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    fontSize: 16,
    color: '#333'
  },
  clearBtn: {
      padding: 10
  }
});