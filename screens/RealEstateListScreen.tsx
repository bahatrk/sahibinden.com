import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { getIlanlar } from '../assets/database/db';
import { Listing } from '../types/Listing';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = StackScreenProps<RootStackParamList, 'RealEstateList'>;

export default function RealEstateListScreen({ route }: Props) {
  const { type, saleType } = route.params;
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const data = getIlanlar();
    console.log("DB'den gelen veri:",data);
    console.log("Route params:",type,saleType);

    const filtered = data.filter(item => item.kategori === "Emlak");

    console.log("Filtrelenmiş veri:",filtered);
    setListings(filtered);
  }, [type, saleType]);

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Sağ taraf: baslık, konum, fiyat*/}
            <View style={styles.info}>
              <Text style={styles.name}>{item.baslik}</Text>
              <View style={styles.subContainer}>
                <Text style={styles.konum}>{item.konum}</Text>
                <Text style={styles.fiyat}>{item.fiyat} TL</Text>
              </View>
            </View>
          </View>
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
    width: 80,   // resim genişliği
    height: 80,  // resim yüksekliği
    borderRadius: 8,
    marginRight: 12, // resim ile info arası boşluk
  },
});
