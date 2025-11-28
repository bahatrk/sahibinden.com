import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {carData} from '../CarScreens/CarData'

type Props = StackScreenProps<RootStackParamList, 'CarMarkaType'>;

export default function CarmarkaTypeScreen({ navigation }: Props) {

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {carData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate('CarList')}
          >
            <Image 
              source={{uri: item.logo}}
              style={styles.logo}
            />

            <Text style={styles.text}>{item.brand}</Text>
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
