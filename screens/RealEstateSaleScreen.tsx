import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = StackScreenProps<RootStackParamList, 'RealEstateSale'>;

export default function RealEstateSaleScreen({ navigation, route }: Props) {
  const { type } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { type, saleType: 'Kiralık' })}
      >
        <Text style={styles.text}>Kiralık</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { type, saleType: 'Satılık' })}
      >
        <Text style={styles.text}>Satılık</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  button: { width: '80%', padding: 20, backgroundColor: 'blue', marginVertical: 15, borderRadius: 10, alignItems: 'center' },
  text: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});
