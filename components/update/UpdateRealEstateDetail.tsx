import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Switch, Text } from "react-native";

type Props = {
  initialData: any; // Contains the full listing data (room_number, square_meter, etc.)
  onSubmit: (data: any) => void;
};

export default function UpdateRealEstateDetail({ initialData, onSubmit }: Props) {
  
  // 1. Initialize State DIRECTLY from initialData
  // We use the exact keys returned from your Stored Procedure (e.g. room_number)
  // Numeric values are converted to strings for TextInputs
  const [roomNumber, setRoomNumber] = useState(initialData.room_number || "");
  const [bathroomNumber, setBathroomNumber] = useState(initialData.bathroom_number ? initialData.bathroom_number.toString() : "");
  const [squareMeter, setSquareMeter] = useState(initialData.square_meter ? initialData.square_meter.toString() : "");
  const [floor, setFloor] = useState(initialData.floor ? initialData.floor.toString() : "");
  const [buildingAge, setBuildingAge] = useState(initialData.building_age ? initialData.building_age.toString() : "");
  
  // Boolean values work directly with Switches
  const [furnished, setFurnished] = useState(initialData.furnished || false);
  const [lift, setLift] = useState(initialData.lift || false);
  const [carPark, setCarPark] = useState(initialData.car_park || false);
  
  const [heat, setHeat] = useState(initialData.heat || "");
  const [kitchen, setKitchen] = useState(initialData.kitchen || "");

  return (
    <View style={{ marginTop: 20 }}>
      {/* 2. Inputs pre-filled with state */}
      
      <TextInput 
        style={styles.input} 
        placeholder="Oda Sayısı" 
        placeholderTextColor={"gray"} 
        value={roomNumber} 
        onChangeText={setRoomNumber} 
        // Note: keeping as default keyboard for inputs like '3+1'
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Banyo Sayısı" 
        placeholderTextColor={"gray"} 
        value={bathroomNumber} 
        onChangeText={setBathroomNumber} 
        keyboardType="numeric" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Metrekare" 
        placeholderTextColor={"gray"} 
        value={squareMeter} 
        onChangeText={setSquareMeter} 
        keyboardType="numeric" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Kat" 
        placeholderTextColor={"gray"} 
        value={floor} 
        onChangeText={setFloor} 
        keyboardType="numeric" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Bina Yaşı" 
        placeholderTextColor={"gray"} 
        value={buildingAge} 
        onChangeText={setBuildingAge} 
        keyboardType="numeric" 
      />

      <View style={styles.row}>
        <Text>Eşyalı:</Text>
        <Switch value={furnished} onValueChange={setFurnished} />
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Isıtma" 
        placeholderTextColor={"gray"} 
        value={heat} 
        onChangeText={setHeat} 
      />
      
      <View style={styles.row}>
        <Text>Asansör:</Text>
        <Switch value={lift} onValueChange={setLift} />
      </View>
      
      <TextInput 
        style={styles.input} 
        placeholder="Mutfak Tipi" 
        placeholderTextColor={"gray"} 
        value={kitchen} 
        onChangeText={setKitchen} 
      />
      
      <View style={styles.row}>
        <Text>Otopark:</Text>
        <Switch value={carPark} onValueChange={setCarPark} />
      </View>

      {/* 3. Update Button */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Değişiklikleri Kaydet"
          color="#FFA500" // Orange to indicate Update
          onPress={() =>
            onSubmit({
              room_number: roomNumber,
              bathroom_number: bathroomNumber ? Number(bathroomNumber) : null,
              square_meter: squareMeter ? Number(squareMeter) : null,
              floor: floor ? Number(floor) : null,
              building_age: buildingAge ? Number(buildingAge) : null,
              furnished,
              heat,
              lift,
              kitchen,
              car_park: carPark,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    marginTop: 10, 
    padding: 10, 
    borderRadius: 6,
    backgroundColor: '#fff' 
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 10, 
    marginBottom: 5, 
    justifyContent: "space-between" 
  },
});