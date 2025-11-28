import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'CarType'> };

export default function CarTypeScreen({ navigation }: Props) {
  return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CarMarkaType', { altKategori: 'Otomobil' })}
          >
            <Text style={styles.text}>Otomobil</Text>
            <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CarMarkaType', { altKategori: 'SUV' })}
          >
            <Text style={styles.text}>Arazi, SUV & Pickup</Text>
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
    backgroundColor: 'white', 
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
  },
});
