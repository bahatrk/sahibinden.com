import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CarListScreen from '../screens/CarListScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import RealEstateListScreen from '../screens/RealEstateListScreen';
import RealEstateDetailScreen from '../screens/RealEstateDetailScreen';
import RealEstateTypeScreen from '../screens/RealEstateTypeScreen'
import RealEstateSaleScreen from '../screens/RealEstateSaleScreen'

export type RootStackParamList = {
    Home: undefined;
    CarList: undefined;
    CarDetail: {id: string};
    RealEstateType: undefined;
    RealEstateSale: {type: string};
    RealEstateList: {type: string; saleType: string};
    RealEstateDetail: {id: string};
};

const Stack = createStackNavigator<RootStackParamList>(); // tüm ekranlar parametreleri dogru tanır

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
        headerStyle: { backgroundColor: '#104E8B' }, // header arka planı mavi
        headerTintColor: '#fff', // yazı rengi beyaz
        headerTitleStyle: { fontWeight: 'bold' },
      }}
      >

        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Anasayfa' }} />
        <Stack.Screen name="CarList" component={CarListScreen} options={{ title: 'Araba İlanları' }} />
        <Stack.Screen name="CarDetail" component={CarDetailScreen} options={{ title: 'İlan Detayı' }} />
        <Stack.Screen name="RealEstateType" component={RealEstateTypeScreen} options={{ title: 'Emlak Tipi' }} />
        <Stack.Screen name="RealEstateSale" component={RealEstateSaleScreen} options={{ title: 'Satış Tipi' }} />
        <Stack.Screen name="RealEstateList" component={RealEstateListScreen} options={{ title: 'Emlak İlanları' }} />
        <Stack.Screen name="RealEstateDetail" component={RealEstateDetailScreen} options={{ title: 'İlan Detayı' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
