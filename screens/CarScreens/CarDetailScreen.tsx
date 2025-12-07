import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { db } from '../../lib/database/db';

export default function RealEstateDetailScreen({ route }: any) {

  const { id } = route.params;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // araba_ilanlari tablosuna gidip id kısmını buluyor ve o id yi çekiyor ve bu id nın degerlerını setitem a atıyor
  useEffect(() => {
    const result = db.getFirstSync(
      `SELECT * FROM araba_ilanlari WHERE id = ?`,
      [id]
    );
    setItem(result);
    setLoading(false);
  }, []);

  if (loading || !item) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* BAŞLIK */}
      <Text style={styles.title}>{item.baslik}</Text>

      {/* RESİMLER */}
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* DETAYLAR */}
      <View style={styles.detailsBox}>
        <Text style={styles.label}>Fiyat</Text>
        <Text style={styles.fiyatValue}>{item.fiyat.toLocaleString("tr-TR")} TL</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Marka</Text>
        <Text style={styles.value}>{item.marka}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>{item.model}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Yıl</Text>
        <Text style={styles.value}>{item.yil}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Yakıt Tipi</Text>
        <Text style={styles.value}>{item.yakitTipi}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Vites</Text>
        <Text style={styles.value}>{item.vites}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Araç Durumu</Text>
        <Text style={styles.value}>{item.aracDurumu}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>KM</Text>
        <Text style={styles.value}>{item.km}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Motor Gücü</Text>
        <Text style={styles.value}>{item.motorGucu} hp</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Renk</Text>
        <Text style={styles.value}>{item.renk}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Kimden</Text>
        <Text style={styles.value}>{item.kimden}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Takas</Text>
        <Text style={styles.value}>{item.takas}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  container: { padding: 15 },
  
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20
  },

  detailsBox: {
    paddingVertical: 3,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center"
  },

  label: {
    marginTop: 5,
    marginBottom: 5,
    color: "#808080"
  },
  value: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
    marginBottom: 5
  },
  fiyatValue: {
    fontWeight: "bold",
    fontSize: 15,
    color: '#104E8B',
    marginTop: 5,
    marginBottom: 5
  },
});
