import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {carData} from './CarData'

type Props = StackScreenProps<RootStackParamList, 'CarModelType'>;

export default function CarModelTypeScreen({ navigation, route }: Props) {

  const { brand, altKategori } = route.params;
  const selectedBrand = carData.find(c => c.brand === brand);

  // Gösterilecek modeller altKategoriye göre seçiliyor
  const selectedModel = altKategori === "Otomobil" ? selectedBrand?.otomobilModels : selectedBrand?.suvModels

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Otomobil veya SUV Modelleri */}
        {selectedModel?.map((model, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate('CarList')}
          >
            <Text style={styles.text}>{model}</Text>
            <MaterialCommunityIcons name="greater-than" size={22} color="black" style={styles.icon}/>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  scroll: {
    paddingBottom: 30
  },
  button: { 
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 35,
    height: 35,
    marginLeft: 20,
    marginRight: 15,
    resizeMode: 'contain'
  },
  text: { 
    color: 'black', 
    fontSize: 20, 
    marginLeft: 20,
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 10,
    color: "#c8c8c8",
  }
});
