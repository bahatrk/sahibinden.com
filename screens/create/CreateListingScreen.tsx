import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useContext } from "react";
import { View, Text, Button, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../navigation/authContext";
import { CategoryEntity } from "../../lib/database/category";
import ListingForm from "../../components/create/ListingForm";
import CategorySelector from "../../components/create/CategorySelector";


type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CreateListing">;
};

export default function CreateListingScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);
  
  // Hangi kategorinin seçildiğini burada tutuyoruz
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

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
        // Kategori seçildiyse FORMU göster
        <ListingForm 
            category={selectedCategory} 
            navigation={navigation}
            onCancel={() => setSelectedCategory(null)} // Kategori seçim ekranına geri dön
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