import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native"; // [!] Import RouteProp
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, KeyboardAvoidingView, Platform, StyleSheet, Alert } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../navigation/authContext";
import { CategoryEntity } from "../../lib/database/category";
import ListingForm from "../../components/create/ListingForm";
import CategorySelector from "../../components/create/CategorySelector";
import { fetchCategoryOfListing } from "../../lib/api/listing";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CreateListing">;
  route: RouteProp<RootStackParamList, "CreateListing">; // [!] Add Route Props
};

export default function CreateListingScreen({ navigation, route }: Props) {
  const { user } = useContext(AuthContext);
  
  // Hangi kategorinin seçildiğini burada tutuyoruz
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

// [!] NEW: Check for Edit Mode & Fetch Category from API
  useEffect(() => {
    const loadCategoryForEdit = async () => {
      // If we have a listing passed via params, we are in EDIT mode
      if (route.params?.listing) {
        try {
          const existing = route.params.listing;
          
          // Call API to get the category details for this listing
          const categoryData = await fetchCategoryOfListing(existing.id);
          
          if (categoryData) {
            setSelectedCategory(categoryData);
          } else {
            Alert.alert("Hata", "Bu ilanın kategori bilgisi bulunamadı.");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Category fetch error:", error);
          Alert.alert("Hata", "Düzenleme için kategori yüklenirken hata oluştu.");
          navigation.goBack();
        }
      }
    };

    loadCategoryForEdit();
  }, [route.params]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Lütfen giriş yapın.</Text>
        <Button title="Giriş Yap" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {selectedCategory ? (
        // Kategori seçildiyse (veya Edit modundaysak) FORMU göster
        <ListingForm 
            category={selectedCategory} 
            navigation={navigation}
            // [!] Pass the existing listing data if available
            existingListing={route.params?.listing}
            
            onCancel={() => {
              setSelectedCategory(null);
              // If we cancel edit, we should clear params so we don't get stuck in edit mode
              navigation.setParams({ listing: undefined });
            }} 
        />
      ) : (
        // Kategori seçilmediyse LİSTEYİ göster
        <CategorySelector 
            onCategorySelected={(cat) => setSelectedCategory(cat)} 
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});