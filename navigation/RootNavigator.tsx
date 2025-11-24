import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CarListScreen from '../screens/CarListScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import RealEstateListScreen from '../screens/RealEstateListScreen';
import RealEstateDetailScreen from '../screens/RealEstateDetailScreen';

export type RootStackParamList = {
    Home: undefined;
    CarList: undefined;
    CarDetail: {id: string};
    RealEstateList: undefined;
    RealEstateDetail: {id: string};
};

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* Ana Sayfa */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Anasayfa' }}
        />

        {/* Araba */}
        <Stack.Screen 
          name="CarList" 
          component={CarListScreen} 
          options={{ title: 'Araba İlanları' }}
        />
        <Stack.Screen 
          name="CarDetail" 
          component={CarDetailScreen} 
          options={{ title: 'İlan Detayı' }}
        />

        {/* Emlak */}
        <Stack.Screen 
          name="RealEstateList" 
          component={RealEstateListScreen} 
          options={{ title: 'Emlak İlanları' }}
        />
        <Stack.Screen 
          name="RealEstateDetail" 
          component={RealEstateDetailScreen} 
          options={{ title: 'İlan Detayı' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
