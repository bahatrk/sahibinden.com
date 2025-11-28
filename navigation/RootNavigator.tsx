import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CarListScreen from '../screens/CarScreens/CarListScreen';
import CarDetailScreen from '../screens/CarScreens/CarDetailScreen';
import RealEstateListScreen from '../screens/RealEstateScreens/RealEstateListScreen';
import RealEstateDetailScreen from '../screens/RealEstateScreens/RealEstateDetailScreen';
import RealEstateTypeScreen from '../screens/RealEstateScreens/RealEstateTypeScreen'
import RealEstateSaleScreen from '../screens/RealEstateScreens/RealEstateSaleScreen'
import CarTypeScreen from '../screens/CarScreens/CarTypeScreen';
import CarMarkaTypeScreen from '../screens/CarScreens/CarMarkaTypeScreen';
import CarModelTypeScreen from '../screens/CarScreens/CarModelTypeScreen'

export type RootStackParamList = {
    Home: undefined;
    CarModelType: {brand: string; altKategori: string};
    CarType: undefined;
    CarMarkaType: {altKategori: string};
    CarList: {altKategori: string; brand: string; model: string};
    CarDetail: {id: string};
    RealEstateType: undefined;
    RealEstateSale: {kategori: string};
    RealEstateList: {kategori: string; satisTuru: string};
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
        <Stack.Screen name="CarType" component={CarTypeScreen} options={{title:'Kategori Seçimi'}} />
        <Stack.Screen name="CarMarkaType" component={CarMarkaTypeScreen} options={{ title: 'Kategori Seçimi'}} />
        <Stack.Screen name="CarModelType" component={CarModelTypeScreen} options={{ title: 'Kategori Seçimi'}} />
        <Stack.Screen name="CarList" component={CarListScreen} options={{ title: 'Araba İlanları' }} />
        <Stack.Screen name="CarDetail" component={CarDetailScreen} options={{ title: 'İlan Detayı' }} />
        <Stack.Screen name="RealEstateType" component={RealEstateTypeScreen} options={{ title: 'Kategori Seçimi' }} />
        <Stack.Screen name="RealEstateSale" component={RealEstateSaleScreen} options={{ title: 'Kategori Seçimi' }} />
        <Stack.Screen name="RealEstateList" component={RealEstateListScreen} options={{ title: 'Arama Sonucu' }} />
        <Stack.Screen name="RealEstateDetail" component={RealEstateDetailScreen} options={{ title: 'İlan Detayı' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
