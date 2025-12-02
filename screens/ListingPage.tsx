import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../type/types';

type ListingPageNavigationProp = StackNavigationProp<RootStackParamList, 'ListingPage'>;
type ListingPageRouteProp = RouteProp<RootStackParamList, 'ListingPage'>;

type Props = {
  navigation: ListingPageNavigationProp;
  route: ListingPageRouteProp;
};

export default function ListingPage({ route }: Props) {
  const { categoryId, categoryName } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Listing for: {categoryName} (ID: {categoryId})</Text>
      {/* Call your ilanlar DB function here */}
    </View>
  );
}
