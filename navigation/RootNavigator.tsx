import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// 1. Remove useState, useEffect, AsyncStorage imports from here

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ListingDetailScreen from "../screens/ListingDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListingScreen from "../screens/create/CreateListingScreen";
import ChatScreen from "../screens/ChatScreen";
import UpdateListingScreen from "../screens/update/UpdateListingScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";

import { RootStackParamList } from "../navigation/types";
import HeaderProfileButton from "../components/HeaderProfileButton";

// 2. Import the Custom Provider we created
import { AuthProvider } from "./authContext"; 
import SearchResultsScreen from "../screens/SearchResultsScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // We removed all the manual 'checkUser' logic from here.
  // The AuthProvider now handles all of that internally.

  return (
    // 3. Wrap everything in the AuthProvider component
    <AuthProvider>
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
            name="SearchResults" 
            component={SearchResultsScreen} 
            options={{ title: "Search Results" }} 
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
            options={{ title: "Edit Listing" }} 
          />

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile" }}
          />

          <Stack.Screen
            name="CreateListing"
            component={CreateListingScreen}
            options={{ title: "Create New Ad" }}
          />

          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: "Messaging", headerBackTitle:"" }}
          />

          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{ title: "Admin" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}