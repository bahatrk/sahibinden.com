import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

type Props = {
  onSubmit: (data: any) => void;
};

export default function CreateRealEstateListing({ onSubmit }: Props) {
  const [roomNumber, setRoomNumber] = useState("");
  const [bathroomNumber, setBathroomNumber] = useState("");
  const [squareMeter, setSquareMeter] = useState("");
  const [floor, setFloor] = useState("");
  const [buildingAge, setBuildingAge] = useState("");
  const [furnished, setFurnished] = useState(false);

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Oda Sayısı"
        value={roomNumber}
        onChangeText={setRoomNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Banyo Sayısı"
        value={bathroomNumber}
        onChangeText={setBathroomNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Metrekare"
        value={squareMeter}
        onChangeText={setSquareMeter}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Kat"
        value={floor}
        onChangeText={setFloor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bina Yaşı"
        value={buildingAge}
        onChangeText={setBuildingAge}
        keyboardType="numeric"
      />
      <Button
        title={furnished ? "Eşyalı: Evet" : "Eşyalı: Hayır"}
        onPress={() => setFurnished(!furnished)}
      />
      <Button
        title="İlanı Oluştur"
        onPress={() =>
          onSubmit({
            roomNumber,
            bathroomNumber,
            squareMeter,
            floor,
            buildingAge,
            furnished,
          })
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
