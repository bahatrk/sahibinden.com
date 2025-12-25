import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Switch, Text } from "react-native";

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
  const [heat, setHeat] = useState("");
  const [lift, setLift] = useState(false);
  const [kitchen, setKitchen] = useState("");
  const [carPark, setCarPark] = useState(false);

  return (
    <View>
      <TextInput style={styles.input} placeholder="Oda Sayısı" placeholderTextColor={"gray"} value={roomNumber} onChangeText={setRoomNumber} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Banyo Sayısı" placeholderTextColor={"gray"} value={bathroomNumber} onChangeText={setBathroomNumber} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Metrekare" placeholderTextColor={"gray"} value={squareMeter} onChangeText={setSquareMeter} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Kat" placeholderTextColor={"gray"} value={floor} onChangeText={setFloor} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bina Yaşı" placeholderTextColor={"gray"} value={buildingAge} onChangeText={setBuildingAge} keyboardType="numeric" />

      <View style={styles.row}>
        <Text>Eşyalı:</Text>
        <Switch value={furnished} onValueChange={setFurnished} />
      </View>

      <TextInput style={styles.input} placeholder="Isıtma" placeholderTextColor={"gray"} value={heat} onChangeText={setHeat} />
      <View style={styles.row}>
        <Text>Asansör:</Text>
        <Switch value={lift} onValueChange={setLift} />
      </View>
      <TextInput style={styles.input} placeholder="Mutfak Tipi" placeholderTextColor={"gray"} value={kitchen} onChangeText={setKitchen} />
      <View style={styles.row}>
        <Text>Otopark:</Text>
        <Switch value={carPark} onValueChange={setCarPark} />
      </View>

      <Button
        title="İlanı Oluştur"
        onPress={() =>
          onSubmit({
            room_number:roomNumber,
            bathroom_number : bathroomNumber ? Number(bathroomNumber) : null,
            square_meter:squareMeter? Number(squareMeter) : null,
            floor:floor? Number(floor) : null,
            building_age:buildingAge? Number(buildingAge) : null,
            furnished,
            heat,
            lift,
            kitchen,
            car_park:carPark,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ddd", marginTop: 10, padding: 10, borderRadius: 6 },
  row: { flexDirection: "row", alignItems: "center",marginTop: 10, marginBottom: 5,justifyContent: "space-between" },
});
