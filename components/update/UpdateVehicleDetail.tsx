import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

type Props = {
  initialData: any; // Contains the full listing data (year, fuel, etc.)
  onSubmit: (data: any) => void;
};

export default function UpdateVehicleDetail({ initialData, onSubmit }: Props) {
  // 1. Initialize State DIRECTLY from initialData
  // We convert numbers to strings for the TextInput value
  // We use the snake_case keys (e.g. body_type) that come from the database JSON
  const [year, setYear] = useState(initialData.year ? initialData.year.toString() : "");
  const [kilometer, setKilometer] = useState(initialData.kilometer ? initialData.kilometer.toString() : "");
  
  const [fuel, setFuel] = useState(initialData.fuel || "");
  const [transmission, setTransmission] = useState(initialData.transmission || "");
  const [bodyType, setBodyType] = useState(initialData.body_type || ""); 
  const [engineCC, setEngineCC] = useState(initialData.engine_cc || "");
  const [instrumental, setInstrumental] = useState(initialData.instrumental || "");
  const [color, setColor] = useState(initialData.color || "");

  return (
    <View style={{ marginTop: 20 }}>
      {/* 2. Inputs pre-filled with state */}
      
      <TextInput 
        style={styles.input} 
        placeholder="Year" 
        placeholderTextColor={"gray"} 
        value={year} 
        keyboardType="number-pad" 
        maxLength={4}  
        onChangeText={(text) => {
          const onlyNumbers = text.replace(/[^0-9]/g, "");
          setYear(onlyNumbers);
        }} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="KM" 
        placeholderTextColor={"gray"} 
        value={kilometer} 
        keyboardType="number-pad"
        onChangeText={(text) => {
          const onlyNumbers = text.replace(/[^0-9]/g, "");
          setKilometer(onlyNumbers);
        }} 
      />
      
      <TextInput style={styles.input} placeholder="Fuel" value={fuel} onChangeText={setFuel} />
      <TextInput style={styles.input} placeholder="Transmission" value={transmission} onChangeText={setTransmission} />
      <TextInput style={styles.input} placeholder="Body Type" value={bodyType} onChangeText={setBodyType} />
      <TextInput style={styles.input} placeholder="Engine CC" value={engineCC} onChangeText={setEngineCC} />
      <TextInput style={styles.input} placeholder="Vehicle Status" value={instrumental} onChangeText={setInstrumental} />
      <TextInput style={styles.input} placeholder="Color" value={color} onChangeText={setColor} />

      {/* 3. Update Button */}
      <View style={{ marginTop: 20 }}>
        <Button
            title="Save Changes"
            color="#FFA500" // Orange to indicate 'Edit' action
            onPress={() =>
            onSubmit({
                // Convert numbers back to numeric types for the API
                year: year ? Number(year) : null,
                fuel,
                transmission,
                kilometer: kilometer ? Number(kilometer) : null,
                body_type: bodyType,
                engine_cc: engineCC,
                instrumental,
                color,
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
});