import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
//import ListingScreen from "../screens/ListingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { CategoryEntity } from "../lib/database/category";
import { ListingWithData } from "../lib/database/listing";
import ListingDetailScreen from "../screens/ListingDetailScreen";

/*
|--------------------------------------------------------------------------
| RootStack Param List
|--------------------------------------------------------------------------
*/
export type RootStackParamList = {
  Home: undefined;

  // Recursive category screen
  Category: CategoryEntity

  // Final screen listing ilanlar
  // Listings: {
  //   categoryId: number;
  //   title: string;
  // };
  ListingDetail: {
    listing: ListingWithData;
  };

  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/*
|--------------------------------------------------------------------------
| Root Navigator
|--------------------------------------------------------------------------
*/
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#104E8B" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "sahibinden.com" }}
        />

        {/* Dynamic Recursive Category Selector */}
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />

        <Stack.Screen
          name="ListingDetail"
          component={ListingDetailScreen}
          options={({ route }) => ({
            title: route.params.listing.title,
          })}
        />

        {/* Final Listings Page */}
        {/* <Stack.Screen
          name="Listings"
          component={ListingScreen}
          options={({ route }) => ({
            title: route.params.title,
          })}
        /> */}

        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 