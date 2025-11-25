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
    const filtered = data.filter(item => item.kategori === "Emlak" && item.type === type && item.saleType === saleType);
    setListings(filtered);
  }, [type, saleType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type} - {saleType}</Text>
      <FlatList
        data={listings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.baslik}</Text>
            <Text style={styles.sub}>{item.aciklama}</Text>
            <Text style={styles.sub}>{item.fiyat} ₺</Text>
            <Text style={styles.sub}>{item.konum}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: { padding: 12, backgroundColor: '#eee', borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '600' },
  sub: { fontSize: 14, color: 'gray' },
  image: { width: "100%", height: 150 },
});
