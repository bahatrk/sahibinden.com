import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = StackScreenProps<RootStackParamList, 'RealEstateSale'>;

export default function RealEstateSaleScreen({ navigation, route }: Props) {
  const { type } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { type, saleType: 'Satılık' })}
      >
        <Text style={styles.text}>Satılık</Text>
        <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon}/>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { type, saleType: 'Kiralık' })}
      >
        <Text style={styles.text}>Kiralık</Text>
        <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    backgroundColor: 'white' 
  },
  button: { 
    paddingVertical: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row', 
  },
  text: { 
    color: 'black', 
    fontSize: 20, 
    marginLeft: 20,
  },
  icon: {
    marginTop: 5,
    marginLeft: 'auto',
    marginRight: 10,
    color: "#c8c8c8",
  }
});
