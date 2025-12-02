import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = StackScreenProps<RootStackParamList, 'RealEstateRealType'>;

export default function RealEstateRealTypeScreen({ navigation, route }: Props) {
  const { kategori, satisTuru } = route.params;

  useEffect(() => {
    if (kategori !== 'Konut') {
        navigation.replace('RealEstateList', { kategori, satisTuru});
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { kategori, satisTuru, emlakTipi: 'Daire' })}
      >
        <Text style={styles.text}>Daire</Text>
        <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon}/>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { kategori, satisTuru, emlakTipi: 'Rezidans' })}
      >
        <Text style={styles.text}>Rezidans</Text>
        <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon}/>
      </TouchableOpacity>

    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RealEstateList', { kategori, satisTuru, emlakTipi: 'Villa' })}
    >
        <Text style={styles.text}>Villa</Text>
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
