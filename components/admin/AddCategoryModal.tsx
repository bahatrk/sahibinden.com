import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Image, ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import { createCategory, fetchCategoryTypes } from "../../lib/api/category";
// Import the new API function

type Props = {
  visible: boolean;
  onClose: () => void;
  parentId: number | null;
  onSuccess: () => void;
};

// Simple Type Interface
interface CatType { id: number; name: string; }

export default function AddCategoryModal({ visible, onClose, parentId, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Type Logic
  const [types, setTypes] = useState<CatType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [isCreatingNewType, setIsCreatingNewType] = useState(false);

  // Load types when modal opens
  useEffect(() => {
    if (visible) {
        loadTypes();
        resetForm();
    }
  }, [visible]);

  const loadTypes = async () => {
      const data = await fetchCategoryTypes();
      setTypes(data);
      if(data.length > 0) setSelectedTypeId(data[0].id); // Default to first
  };

  const resetForm = () => {
      setName(""); setImageUri(null); setNewTypeName(""); setIsCreatingNewType(false);
  };

  const pickImage = async () => {
    /* ... (Same as before) ... */
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  async function handleSubmit() {
    if (!name.trim()) return Alert.alert("Mistake", "Category name required");
    
    // Validation for Type
    if (isCreatingNewType && !newTypeName.trim()) 
        return Alert.alert("Mistake", "Enter a new type name.");
    
    setLoading(true);
    
    // Send either ID or New Name based on mode
    const finalTypeId = isCreatingNewType ? null : selectedTypeId;
    const finalTypeName = isCreatingNewType ? newTypeName : null;

    const result = await createCategory(name, parentId, finalTypeId, finalTypeName, imageUri || undefined);
    
    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      Alert.alert("Mistake", "The category could not be created.");
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.title}>
                {parentId ? "Add Subcategory" : "Add Main Category"}
              </Text>

              {/* 1. Name Input */}
              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={name}
                onChangeText={setName}
              />

              {/* 2. Type Selection (Only if Root or if you want to allow changing type for subs) */}
              <Text style={styles.label}>Category Type:</Text>
              
              {!isCreatingNewType ? (
                  <View style={styles.typeSelector}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {types.map((t) => (
                            <TouchableOpacity 
                                key={t.id} 
                                style={[styles.typeBadge, selectedTypeId === t.id && styles.typeBadgeSelected]}
                                onPress={() => setSelectedTypeId(t.id)}
                            >
                                <Text style={[styles.typeText, selectedTypeId === t.id && styles.typeTextSelected]}>
                                    {t.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                      </ScrollView>
                      
                      {/* Only show "Add New" button if it is a Root Category */}
                      {!parentId && (
                          <TouchableOpacity onPress={() => setIsCreatingNewType(true)}>
                              <Text style={styles.linkText}>+ Create New Type</Text>
                          </TouchableOpacity>
                      )}
                  </View>
              ) : (
                  <View>
                      <TextInput 
                        style={styles.input} 
                        placeholder="New Type Name (e.g., Real Estate, Vehicle)"
                        value={newTypeName}
                        onChangeText={setNewTypeName}
                      />
                      <TouchableOpacity onPress={() => setIsCreatingNewType(false)}>
                          <Text style={styles.linkText}>Select from List</Text>
                      </TouchableOpacity>
                  </View>
              )}

              {/* 3. Image Picker */}
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Feather name="camera" size={24} color="gray" />
                    <Text style={{color:'gray'}}>Select Logo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* 4. Buttons */}
              <View style={styles.buttons}>
                <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                  <Text style={{ color: "red" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Save</Text>}
                </TouchableOpacity>
              </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContainer: { backgroundColor: "white", borderRadius: 10, padding: 20, maxHeight: '80%' },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 15 },
  label: { fontWeight:'bold', marginBottom: 5, color: '#333'},
  
  // Type Selector Styles
  typeSelector: { marginBottom: 15 },
  typeBadge: { 
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, 
      backgroundColor: '#f0f0f0', marginRight: 8, borderWidth: 1, borderColor: '#eee' 
  },
  typeBadgeSelected: { backgroundColor: '#2E5894', borderColor: '#2E5894' },
  typeText: { color: '#333' },
  typeTextSelected: { color: 'white', fontWeight: 'bold' },
  linkText: { color: '#2E5894', marginTop: 5, textDecorationLine: 'underline' },

  imagePicker: { alignItems: "center", justifyContent: "center", marginBottom: 20, borderWidth: 1, borderColor: "#eee", borderStyle: "dashed", borderRadius: 8, padding: 10 },
  imagePlaceholder: { alignItems: "center" },
  previewImage: { width: 100, height: 100, borderRadius: 8 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancelBtn: { padding: 10 },
  saveBtn: { backgroundColor: "#2E5894", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
});