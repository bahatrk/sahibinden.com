import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'RealEstateType'> };

export default function RealEstateTypeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateSale', { type: 'Konut' })}
      >
        <Text style={styles.text}>Konut</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateSale', { type: 'Bina' })}
      >
        <Text style={styles.text}>Bina</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  button: { width: '80%', padding: 20, backgroundColor: 'orange', marginVertical: 15, borderRadius: 10, alignItems: 'center' },
  text: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});
