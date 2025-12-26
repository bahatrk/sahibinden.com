import React from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import UpdateListingForm from "../../components/update/UpdateListingForm";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "UpdateListing">;
  route: RouteProp<RootStackParamList, "UpdateListing">;
};

export default function UpdateListingScreen({ navigation, route }: Props) {
  const { listing } = route.params;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9f9f9' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <UpdateListingForm 
        listing={listing} 
        navigation={navigation}
      />
    </KeyboardAvoidingView>
  );
}