import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = StackScreenProps<RootStackParamList, 'CarMarkaType'>;

export default function CarmarkaTypeScreen({ navigation }: Props) {

  // markaların oldugu array
  const brands = [
    'Audi', 'BMW', 'Chery', 'Dodge', 'Ford', 'Honda', 'Hyundai', 'Kia',
    'Mercedes-Benz', 'Nissan', 'Opel', 'Peugeot', 'Porsche', 'Renault',
    'Skoda', 'TOGG', 'Toyota', 'Volkswagen'
  ];

  // markaların logoları
  const brandLogos = [
    'https://i.pinimg.com/736x/2d/46/f3/2d46f364e5a5edabc69f6dd4ab0c4e54.jpg',
    'https://i.pinimg.com/736x/d5/2d/bb/d52dbb929ad9353d39537f01a60fa6f0.jpg',
    'https://i.pinimg.com/1200x/ae/6a/aa/ae6aaa73e0483458c54348bd4cf9082b.jpg',
    'https://i.pinimg.com/1200x/ef/a3/18/efa318decff6823a12b1cae5ac81fb60.jpg',
    'https://i.pinimg.com/1200x/31/15/8b/31158b7fd6b665dc137abf4d6700e3d6.jpg',
    'https://i.pinimg.com/1200x/fa/49/dc/fa49dcaf6ae263e7e796590c6c610cd4.jpg',
    'https://i.pinimg.com/736x/48/ea/3e/48ea3e86df65c9bab9f3a961ad1f1df1.jpg',
    'https://i.pinimg.com/1200x/98/67/c7/9867c7ce44d8b9d20f4d85829488c8b0.jpg',
    'https://i.pinimg.com/736x/f2/0b/a6/f20ba65164b6fc224d036ad519cb6a09.jpg',
    'https://i.pinimg.com/1200x/93/c5/0c/93c50c059576b9282b1ebd33edcd7ea0.jpg',
    'https://i.pinimg.com/1200x/6a/2e/21/6a2e21f4fc09ffb8b299e73fee23bd97.jpg',
    'https://i.pinimg.com/1200x/2b/04/fd/2b04fd2b361abae98dfe64662450d882.jpg',
    'https://i.pinimg.com/736x/b2/88/83/b28883eebed8dc930f92e82587eb1ec7.jpg',
    'https://i.pinimg.com/736x/09/32/2b/09322bb85b0311254f995390b2d99d27.jpg',
    'https://i.pinimg.com/1200x/a5/2e/88/a52e882d1d45f22b7be7b00e75b2552e.jpg',
    'https://i.pinimg.com/1200x/8c/b9/1c/8cb91cf8315e946a695aa7f9adbbf9e0.jpg',
    'https://i.pinimg.com/1200x/5c/94/92/5c94927a6199a01174a919f04b060f87.jpg',
    'https://i.pinimg.com/736x/74/3c/59/743c59530f840b351e235a426195f964.jpg',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {brands.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate('CarList')}
          >
            <Image 
              source={{uri: brandLogos[index]}}
              style={styles.logo}
            />

            <Text style={styles.text}>{item}</Text>
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
