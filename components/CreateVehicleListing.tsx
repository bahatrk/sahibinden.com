import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

type Props = {
  onSubmit: (data: any) => void;
};

export default function CreateVehicleListing({ onSubmit }: Props) {
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [engineCC, setEngineCC] = useState("");

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Yıl"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Yakıt"
        value={fuel}
        onChangeText={setFuel}
      />
      <TextInput
        style={styles.input}
        placeholder="Vites"
        value={transmission}
        onChangeText={setTransmission}
      />
      <TextInput
        style={styles.input}
        placeholder="KM"
        value={kilometer}
        onChangeText={setKilometer}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Kasa Tipi"
        value={bodyType}
        onChangeText={setBodyType}
      />
      <TextInput
        style={styles.input}
        placeholder="Motor Hacmi"
        value={engineCC}
        onChangeText={setEngineCC}
      />
      <Button
        title="İlanı Oluştur"
        onPress={() =>
          onSubmit({ year, fuel, transmission, kilometer, bodyType, engineCC })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
});
