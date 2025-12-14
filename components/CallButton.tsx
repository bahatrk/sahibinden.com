import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, Linking } from "react-native";

type Props = {
  phone?: string | null;
  size?: number; // opsiyonel, ileride ikon boyutu vs için
};

export default function CallButton({ phone, size = 16 }: Props) {
  const handlePress = () => {
    if (!phone) {
      Alert.alert("Telefon numarası bulunamadı");
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={[styles.buttonText, { fontSize: size }]}>📞 Ara</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0.4,       
    paddingVertical: 8,   
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#104E8B",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
