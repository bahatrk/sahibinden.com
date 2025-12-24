import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Switch, Text } from "react-native";

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
  const [instrumental, setInstrumental] = useState("");
  const [color, setColor] = useState("");

  return (
    <View>
      <TextInput style={styles.input} placeholder="Yıl" placeholderTextColor={"gray"} value={year} onChangeText={setYear} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Yakıt" placeholderTextColor={"gray"} value={fuel} onChangeText={setFuel} />
      <TextInput style={styles.input} placeholder="Vites" placeholderTextColor={"gray"} value={transmission} onChangeText={setTransmission} />
      <TextInput style={styles.input} placeholder="KM" placeholderTextColor={"gray"} value={kilometer} onChangeText={setKilometer} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Kasa Tipi" placeholderTextColor={"gray"} value={bodyType} onChangeText={setBodyType} />
      <TextInput style={styles.input} placeholder="Motor Hacmi" placeholderTextColor={"gray"} value={engineCC} onChangeText={setEngineCC} />
      <TextInput style={styles.input} placeholder="Araç Durumu" placeholderTextColor={"gray"} value={instrumental} onChangeText={setInstrumental} />
      <TextInput style={styles.input} placeholder="Renk" placeholderTextColor={"gray"} value={color} onChangeText={setColor} />

      <Button
        title="İlanı Oluştur"
        onPress={() =>
          onSubmit({
            year,
            fuel,
            transmission,
            kilometer,
            bodyType,
            engineCC,
            instrumental,
            color,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ddd", marginTop: 10, padding: 10, borderRadius: 6 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between" },
});
