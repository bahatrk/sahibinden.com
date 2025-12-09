import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "expo-sqlite/kv-store";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ListingDetailScreen from "../screens/ListingDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { CategoryEntity } from "../lib/database/category";
import { ListingWithData } from "../lib/database/listing";

export type RootStackParamList = {
  Home:undefined;
  Category: CategoryEntity;
  ListingDetail: { listing: ListingWithData };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return null; // Splash ekranı ekleyebilirsin

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#104E8B" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "sahibinden.com" }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen
          name="ListingDetail"
          component={ListingDetailScreen}
          options={({ route }) => ({ title: route.params.listing.title })}
        />

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
