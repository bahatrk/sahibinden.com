import React, { createContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "expo-sqlite/kv-store";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ListingDetailScreen from "../screens/ListingDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "./authContext";
import HeaderProfileButton from "../components/HeaderProfileButton";
import CreateListingScreen from "../screens/create/CreateListingScreen";
import ChatScreen from "../screens/ChatScreen";
import UpdateListingScreen from "../screens/update/UpdateListingScreen";

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
    <AuthContext.Provider value={{ user, setUser }}>
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
            options={({ navigation }) => ({
              title: "sahibinden.com",
              headerRight: () => (
                <HeaderProfileButton navigation={navigation} />
              ),
            })}
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
          <Stack.Screen 
          name="UpdateListing" 
          component={UpdateListingScreen} 
          options={{ title: "İlanı Düzenle" }} // Optional: Sets the header title
          />

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profil" }}
          />

          <Stack.Screen
            name="CreateListing"
            component={CreateListingScreen}
            options={{ title: "Yeni İlan Oluştur" }}
          />

          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({
              title: "Mesajlaşma",
              headerBackTitleVisible: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
