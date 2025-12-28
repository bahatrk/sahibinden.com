import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Switch, Text, ScrollView } from "react-native";

type Props = {
  initialData: any;
  onSubmit: (data: any) => void;
};

// Hata objesi için tip tanımı
type ErrorType = {
  room_number?: string;
  bathroom_number?: string;
  square_meter?: string;
  floor?: string;
  building_age?: string;
  heat?: string;
  kitchen?: string;
};

export default function UpdateRealEstateDetail({ initialData, onSubmit }: Props) {
  
  // --- STATE TANIMLARI ---
  const [roomNumber, setRoomNumber] = useState(initialData.room_number || "");
  const [bathroomNumber, setBathroomNumber] = useState(initialData.bathroom_number != null ? initialData.bathroom_number.toString() : "");
  const [squareMeter, setSquareMeter] = useState(initialData.square_meter != null ? initialData.square_meter.toString() : "");
  const [floor, setFloor] = useState(initialData.floor != null ? initialData.floor.toString() : "");
  const [buildingAge, setBuildingAge] = useState(initialData.building_age != null ? initialData.building_age.toString() : "");
  
  const [furnished, setFurnished] = useState(initialData.furnished || false);
  const [lift, setLift] = useState(initialData.lift || false);
  const [carPark, setCarPark] = useState(initialData.car_park || false);
  
  const [heat, setHeat] = useState(initialData.heat || "");
  const [kitchen, setKitchen] = useState(initialData.kitchen || "");

  // Hataları tutacak state
  const [errors, setErrors] = useState<ErrorType>({});

  // --- VALIDASYON FONKSİYONU ---
  const validateForm = () => {
    let isValid = true;
    let newErrors: ErrorType = {};

    // 1. Oda Sayısı Kontrolü
    if (!roomNumber.trim()) {
      newErrors.room_number = "Rooms cannot be left empty.";
      isValid = false;
    }

    // 2. Banyo Sayısı Kontrolü (Sayı olmalı, pozitif olmalı)
    if (!bathroomNumber) {
      newErrors.bathroom_number = "Enter the number of bathrooms.";
      isValid = false;
    } else if (isNaN(Number(bathroomNumber)) || Number(bathroomNumber) < 0) {
      newErrors.bathroom_number = "Enter a valid number.";
      isValid = false;
    }

    // 3. Metrekare Kontrolü (Sayı olmalı, 0'dan büyük olmalı)
    if (!squareMeter) {
      newErrors.square_meter = "Enter the square meters";
      isValid = false;
    } else if (isNaN(Number(squareMeter)) || Number(squareMeter) <= 0) {
      newErrors.square_meter = "Please enter a valid square meter value.";
      isValid = false;
    }

    // 4. Kat Kontrolü (Sadece sayı olmalı, negatif olabilir - kot katlar için)
    if (floor === "") {
      newErrors.floor = "Please enter the floor information.";
      isValid = false;
    } else if (isNaN(Number(floor))) {
      newErrors.floor = "Floor can only be a number.";
      isValid = false;
    }

    // 5. Bina Yaşı Kontrolü (Sayı olmalı, 0 veya büyük olmalı)
    if (buildingAge === "") {
      newErrors.building_age = "Enter building age.";
      isValid = false;
    } else if (isNaN(Number(buildingAge)) || Number(buildingAge) < 0) {
      newErrors.building_age = "Please enter a valid age.";
      isValid = false;
    }

    // 6. Isıtma Tipi Kontrolü (En az 3 karakter)
    if (!heat.trim()) {
      newErrors.heat = "Enter the hheating type.";
      isValid = false;
    } else if (heat.length < 3) {
      newErrors.heat = "Please be more descriptive (e.g.,Combi boiler)";
      isValid = false;
    }

    // 7. Mutfak Tipi Kontrolü
    if (!kitchen.trim()) {
      newErrors.kitchen = "Enter kitchen type.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    // Validasyonu çalıştır, geçerliyse gönder
    if (validateForm()) {
      onSubmit({
        room_number: roomNumber,
        bathroom_number: Number(bathroomNumber),
        square_meter: Number(squareMeter),
        floor: Number(floor),
        building_age: Number(buildingAge),
        furnished,
        heat,
        lift,
        kitchen,
        car_park: carPark,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={{ marginTop: 20 }}>
        
        {/* ROOM NUMBER */}
        <TextInput 
          style={[styles.input, errors.room_number && styles.inputError]} 
          placeholder="Number of Rooms(e.g.,3+1)" 
          value={roomNumber} 
          onChangeText={(text) => {
            setRoomNumber(text);
            if(errors.room_number) setErrors({...errors, room_number: undefined}); // Yazarken hatayı sil
          }} 
        />
        {errors.room_number && <Text style={styles.errorText}>{errors.room_number}</Text>}
        
        {/* BATHROOM NUMBER */}
        <TextInput 
          style={[styles.input, errors.bathroom_number && styles.inputError]} 
          placeholder="Number of bathrooms" 
          value={bathroomNumber} 
          onChangeText={(text) => {
            setBathroomNumber(text);
            if(errors.bathroom_number) setErrors({...errors, bathroom_number: undefined});
          }} 
          keyboardType="numeric" 
        />
        {errors.bathroom_number && <Text style={styles.errorText}>{errors.bathroom_number}</Text>}
        
        {/* SQUARE METER */}
        <TextInput 
          style={[styles.input, errors.square_meter && styles.inputError]} 
          placeholder="Square meters (m²)" 
          value={squareMeter} 
          onChangeText={(text) => {
            setSquareMeter(text);
            if(errors.square_meter) setErrors({...errors, square_meter: undefined});
          }} 
          keyboardType="numeric" 
        />
        {errors.square_meter && <Text style={styles.errorText}>{errors.square_meter}</Text>}
        
        {/* FLOOR */}
        <TextInput 
          style={[styles.input, errors.floor && styles.inputError]} 
          placeholder="Floor" 
          value={floor} 
          onChangeText={(text) => {
            setFloor(text);
            if(errors.floor) setErrors({...errors, floor: undefined});
          }} 
          keyboardType="numeric" 
        />
        {errors.floor && <Text style={styles.errorText}>{errors.floor}</Text>}
        
        {/* BUILDING AGE */}
        <TextInput 
          style={[styles.input, errors.building_age && styles.inputError]} 
          placeholder="Building age" 
          value={buildingAge} 
          onChangeText={(text) => {
            setBuildingAge(text);
            if(errors.building_age) setErrors({...errors, building_age: undefined});
          }} 
          keyboardType="numeric" 
        />
        {errors.building_age && <Text style={styles.errorText}>{errors.building_age}</Text>}

        {/* SWITCHES */}
        <View style={styles.row}>
          <Text style={styles.label}>Furnished?</Text>
          <Switch value={furnished} onValueChange={setFurnished} />
        </View>

        {/* HEAT */}
        <TextInput 
          style={[styles.input, errors.heat && styles.inputError]} 
          placeholder="Heat Type" 
          value={heat} 
          onChangeText={(text) => {
            setHeat(text);
            if(errors.heat) setErrors({...errors, heat: undefined});
          }} 
        />
        {errors.heat && <Text style={styles.errorText}>{errors.heat}</Text>}
        
        <View style={styles.row}>
          <Text style={styles.label}>Lift?</Text>
          <Switch value={lift} onValueChange={setLift} />
        </View>
        
        {/* KITCHEN */}
        <TextInput 
          style={[styles.input, errors.kitchen && styles.inputError]} 
          placeholder="Kitch" 
          value={kitchen} 
          onChangeText={(text) => {
            setKitchen(text);
            if(errors.kitchen) setErrors({...errors, kitchen: undefined});
          }} 
        />
        {errors.kitchen && <Text style={styles.errorText}>{errors.kitchen}</Text>}
        
        <View style={styles.row}>
          <Text style={styles.label}>Parking?</Text>
          <Switch value={carPark} onValueChange={setCarPark} />
        </View>

        {/* SUBMIT BUTTON */}
        <View style={{ marginTop: 25 }}>
          <Button
            title="Save Changes"
            color="#FFA500"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    marginTop: 10, 
    padding: 12, 
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16
  },
  inputError: {
    borderColor: "red", // Hata varsa çerçeve kırmızı olsun
    borderWidth: 1.5
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 5
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 15, 
    marginBottom: 5, 
    justifyContent: "space-between",
    paddingHorizontal: 5
  },
  label: {
    fontSize: 16,
    color: '#333'
  }
});