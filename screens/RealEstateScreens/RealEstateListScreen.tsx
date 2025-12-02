import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getEmlakIlanlar } from '../../assets/database/db';
import { RealEstateListing } from '../../types/Listing';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = StackScreenProps<RootStackParamList, 'RealEstateList'>;

export default function RealEstateListScreen({ navigation,route }: Props) {
  const { kategori, satisTuru, emlakTipi } = route.params;
  console.log(`Parametreler: kategori=${kategori}, satış türü=${satisTuru}, emlak tipi=${emlakTipi}`);
  const [listings, setListings] = useState<RealEstateListing[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {             // Migration tamam
        const data = getEmlakIlanlar(); // Veriyi çek
        console.log(data.map(i => ({ kategori: i.kategori, emlakTipi: i.emlakTipi })));

        const filtered = data.filter(item => {
          if (item.kategori?.toLowerCase() !== kategori?.toLowerCase()) return false;
          if (item.satisTuru?.toLowerCase() !== satisTuru?.toLowerCase()) return false;

          // Konut için emlakTipi parametre doluysa kontrol et
          if (kategori?.toLowerCase() === 'konut' && emlakTipi) {
            if (!item.emlakTipi || item.emlakTipi.toLowerCase() !== emlakTipi.toLowerCase()) return false;
          }

          return true;
        });


        console.log("Filtreli sonuç: ", filtered);

        setListings(filtered);
      } catch (err) {
        console.log("DB HATA:", err);
      }
    };

    loadData();
  }, [kategori, satisTuru, emlakTipi]);

  return (
    <View style={styles.container}>
      {listings.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50, fontSize: 16 }}>
          İlan bulunamadı
        </Text>
      ) : (
        <FlatList
        data={listings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("RealEstateDetail", {id: item.id})}
          >

            <Image 
              source={{ uri: item.image }} style={styles.image} 
            />

            {/* Sağ taraf: baslık, konum, fiyat*/}
            <View style={styles.info}>
              <Text style={styles.name}>{item.baslik}</Text>
              <View style={styles.subContainer}>
                <Text style={styles.konum}>{item.konum}</Text>
                <Text style={styles.fiyat}>{item.fiyat.toLocaleString("tr-TR")} TL</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      )}
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
