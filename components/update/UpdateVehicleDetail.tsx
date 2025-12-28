import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from "react-native";

type Props = {
  initialData: any;
  onSubmit: (data: any) => void;
};

// Hata objesi için tip tanımı
type ErrorType = {
  year?: string;
  kilometer?: string;
  fuel?: string;
  transmission?: string;
  body_type?: string;
  engine_cc?: string;
  instrumental?: string;
  color?: string;
};

export default function UpdateVehicleDetail({ initialData, onSubmit }: Props) {
  
  // 1. State Tanımları
  const [year, setYear] = useState(initialData.year ? initialData.year.toString() : "");
  const [kilometer, setKilometer] = useState(initialData.kilometer ? initialData.kilometer.toString() : "");
  
  const [fuel, setFuel] = useState(initialData.fuel || "");
  const [transmission, setTransmission] = useState(initialData.transmission || "");
  const [bodyType, setBodyType] = useState(initialData.body_type || ""); 
  const [engineCC, setEngineCC] = useState(initialData.engine_cc || "");
  const [instrumental, setInstrumental] = useState(initialData.instrumental || "");
  const [color, setColor] = useState(initialData.color || "");

  // Hataları tutacak state
  const [errors, setErrors] = useState<ErrorType>({});

  // 2. Validasyon Fonksiyonu
  const validateForm = () => {
    let isValid = true;
    let newErrors: ErrorType = {};
    const currentYear = new Date().getFullYear();

    // Yıl Kontrolü
    if (!year.trim()) {
      newErrors.year = "Enter year information.";
      isValid = false;
    } else if (year.length !== 4) {
      newErrors.year = "The year must be a four-digit number";
      isValid = false;
    } else {
      const yearNum = Number(year);
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = "Enter a valid year.";
        isValid = false;
      }
    }

    // Kilometre Kontrolü
    if (!kilometer.trim()) {
      newErrors.kilometer = "Enter KM information.";
      isValid = false;
    }

    // Yakıt
    if (!fuel.trim()) {
      newErrors.fuel = "Enter fuel type.";
      isValid = false;
    }

    // Vites
    if (!transmission.trim()) {
      newErrors.transmission = "Enter transmission type.";
      isValid = false;
    }

    // Kasa Tipi
    if (!bodyType.trim()) {
      newErrors.body_type = "Enter body type.";
      isValid = false;
    }

    // Motor Hacmi
    if (!engineCC.trim()) {
      newErrors.engine_cc = "Enter engine cc.";
      isValid = false;
    }

    // Araç Durumu
    if (!instrumental.trim()) {
      newErrors.instrumental = "Enter vehicle status.";
      isValid = false;
    }

    // Renk
    if (!color.trim()) {
      newErrors.color = "Enter color.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 3. Submit İşlemi
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        year: year ? Number(year) : null,
        fuel,
        transmission,
        kilometer: kilometer ? Number(kilometer) : null,
        body_type: bodyType,
        engine_cc: engineCC,
        instrumental,
        color,
      });
    }
  };

  // 4. Input Değişiminde Hatayı Temizleme Yardımcısı
  const handleTextChange = (field: keyof ErrorType, value: string, setter: (val: string) => void) => {
    setter(value);
    // Eğer o alanda hata varsa ve kullanıcı bir şey yazdıysa hatayı sil
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={{ marginTop: 20 }}>
        
        {/* YEAR */}
        <TextInput 
          style={[styles.input, errors.year && styles.inputError]} 
          placeholder="Year" 
          placeholderTextColor={"gray"} 
          value={year} 
          keyboardType="number-pad" 
          maxLength={4}  
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            handleTextChange("year", onlyNumbers, setYear);
          }} 
        />
        {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
        
        {/* KILOMETER */}
        <TextInput 
          style={[styles.input, errors.kilometer && styles.inputError]} 
          placeholder="KM" 
          placeholderTextColor={"gray"} 
          value={kilometer} 
          keyboardType="number-pad"
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            handleTextChange("kilometer", onlyNumbers, setKilometer);
          }} 
        />
        {errors.kilometer && <Text style={styles.errorText}>{errors.kilometer}</Text>}
        
        {/* FUEL */}
        <TextInput 
          style={[styles.input, errors.fuel && styles.inputError]} 
          placeholder="Fuel" 
          value={fuel} 
          onChangeText={(text) => handleTextChange("fuel", text, setFuel)} 
        />
        {errors.fuel && <Text style={styles.errorText}>{errors.fuel}</Text>}

        {/* TRANSMISSION */}
        <TextInput 
          style={[styles.input, errors.transmission && styles.inputError]} 
          placeholder="Transmission" 
          value={transmission} 
          onChangeText={(text) => handleTextChange("transmission", text, setTransmission)} 
        />
        {errors.transmission && <Text style={styles.errorText}>{errors.transmission}</Text>}

        {/* BODY TYPE */}
        <TextInput 
          style={[styles.input, errors.body_type && styles.inputError]} 
          placeholder="Body Type" 
          value={bodyType} 
          onChangeText={(text) => handleTextChange("body_type", text, setBodyType)} 
        />
        {errors.body_type && <Text style={styles.errorText}>{errors.body_type}</Text>}

        {/* ENGINE CC */}
        <TextInput 
          style={[styles.input, errors.engine_cc && styles.inputError]} 
          placeholder="Engine CC" 
          value={engineCC} 
          onChangeText={(text) => handleTextChange("engine_cc", text, setEngineCC)} 
        />
        {errors.engine_cc && <Text style={styles.errorText}>{errors.engine_cc}</Text>}

        {/* INSTRUMENTAL / STATUS */}
        <TextInput 
          style={[styles.input, errors.instrumental && styles.inputError]} 
          placeholder="Vehicle Status" 
          value={instrumental} 
          onChangeText={(text) => handleTextChange("instrumental", text, setInstrumental)} 
        />
        {errors.instrumental && <Text style={styles.errorText}>{errors.instrumental}</Text>}

        {/* COLOR */}
        <TextInput 
          style={[styles.input, errors.color && styles.inputError]} 
          placeholder="Color" 
          value={color} 
          onChangeText={(text) => handleTextChange("color", text, setColor)} 
        />
        {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}

        {/* UPDATE BUTTON */}
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
    borderColor: "#ddd", 
    marginTop: 10, 
    padding: 12, 
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 16
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 5,
  }
});