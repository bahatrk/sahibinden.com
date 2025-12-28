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
      <TextInput style={styles.input} placeholder="Number of Rooms" placeholderTextColor={"gray"} value={roomNumber} onChangeText={setRoomNumber} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Number of Bathrooms" placeholderTextColor={"gray"} value={bathroomNumber} onChangeText={setBathroomNumber} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Square meters" placeholderTextColor={"gray"} value={squareMeter} onChangeText={setSquareMeter} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Floor" placeholderTextColor={"gray"} value={floor} onChangeText={setFloor} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Building Age" placeholderTextColor={"gray"} value={buildingAge} onChangeText={setBuildingAge} keyboardType="numeric" />

      <View style={styles.row}>
        <Text>Furnished:</Text>
        <Switch value={furnished} onValueChange={setFurnished} />
      </View>

      <TextInput style={styles.input} placeholder="Heating" placeholderTextColor={"gray"} value={heat} onChangeText={setHeat} />
      <View style={styles.row}>
        <Text>Lift:</Text>
        <Switch value={lift} onValueChange={setLift} />
      </View>
      <TextInput style={styles.input} placeholder="Kitchen Type" placeholderTextColor={"gray"} value={kitchen} onChangeText={setKitchen} />
      <View style={styles.row}>
        <Text>Parking:</Text>
        <Switch value={carPark} onValueChange={setCarPark} />
      </View>

      <Button
        title="Create Listing"
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
