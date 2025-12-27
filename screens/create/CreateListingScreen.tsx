import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useContext } from "react";
import { View, Text, Button, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../navigation/authContext";
import { CategoryEntity } from "../../lib/database/category";
import ListingForm from "../../components/create/ListingForm";
import CategorySelector from "../../components/create/CategorySelector";

// Note: We don't strictly need RouteProp anymore since we aren't reading params
type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CreateListing">;
};

export default function CreateListingScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);
  
  // State to track if user has selected a category yet
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

  // 1. Check Auth
  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in.</Text>
        <Button title="Log in" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {selectedCategory ? (
        // 2. If Category is selected, Show the Form
        <ListingForm 
            category={selectedCategory} 
            navigation={navigation}
            // No 'existingListing' prop needed here anymore
            onCancel={() => {
              // If user cancels, just go back to category selection
              setSelectedCategory(null);
            }} 
        />
      ) : (
        // 3. Otherwise, Show the Category Selector (Root -> Sub -> Sub)
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