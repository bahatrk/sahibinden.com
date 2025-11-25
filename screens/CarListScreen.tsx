import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image} from 'react-native';
import { getIlanlar } from '../assets/database/db';
import { Listing } from '../types/Listing';

export default function CarListScreen() {
  const [cars, setCars] = useState<Listing[]>([]);

  useEffect(() => {
    const data =getIlanlar();
    console.log("Gelen Veriler:", data);

    // Filtreleme sadece araba kategorisi
    const filtered = data.filter(item => item.kategori === "Araba");

    console.log("Filtrelenmiş (Araba) Veriler:", filtered.map(i => i.image));
    setCars(filtered);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Araba İlanları</Text>
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.baslik}</Text>
            <Text style={styles.sub}>{item.aciklama}</Text>
            <Text style={styles.sub}>{item.fiyat} ₺</Text>
            <Text style={styles.sub}>{item.konum}</Text>
            <Image 
              source={{ uri: item.image }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: '600' },
  sub: { fontSize: 14, color: 'gray' },
  image: {
    width: "100%",
    height: 150,
  },
});
