import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getArabaIlanlar } from '../../assets/database/db';
import { CarListing } from '../../types/Listing';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { runMigrations } from '../../assets/database/migrate';

type Props = StackScreenProps<RootStackParamList, 'CarList'>;


export default function CarListScreen({ navigation,route }: Props) {

  const {altKategori, brand, model} = route.params;
  const [cars, setCars] = useState<CarListing[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        runMigrations();               // Migration tamam
        const data = getArabaIlanlar(); // Veriyi çek

        // Parametrele göre filtreleme
        const filtered = data.filter(item => 
          item.altKategori === altKategori &&
          item.marka === brand &&
          item.model === model
        );

        console.log("Filtreli sonuç: ", filtered);

        setCars(filtered);
      } catch (err) {
        console.log("DB HATA:", err);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={cars}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("CarDetail", {id: item.id})}
          >
            <Image 
              source={{ uri: item.image }} style={styles.image} 
            />

            {/* Sağ taraf: baslık, konum, fiyat*/}
            <View style={styles.info}>
              <Text style={styles.name}>{item.baslik}</Text>
              <View style={styles.subContainer}>
                <Text style={styles.konum}>{item.konum}</Text>
                <Text style={styles.fiyat}>{item.fiyat} TL</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: 'white', 
  },
  item: { 
    padding: 12,
    height: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  info: {
    flex: 1, // kalan alanı kaplar
    justifyContent: "center",
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600',
    marginBottom: 30,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fiyat: { 
    fontSize: 14, 
    color: '#104E8B', 
    fontWeight: "bold",
  },
  konum: {
    fontSize: 14,
    color: "gray",
  },
  image: {
    width: 120,   // resim genişliği
    height: 120,  // resim yüksekliği
    borderRadius: 8,
    marginRight: 12, // resim ile info arası boşluk
    resizeMode: "contain"
  },
});
