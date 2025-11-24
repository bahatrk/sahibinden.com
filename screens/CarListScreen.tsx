import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getIlanlar } from "../assets/database/db"; // helper fonksiyon

type CarListNavigationProp = StackNavigationProp<RootStackParamList, "CarList">;

type Props = {
  navigation: CarListNavigationProp;
};

type Ilan = {
  id: number;
  kategori: string;
  baslik: string;
  aciklama: string;
  fiyat: string;
  konum: string;
  image: string;
};

export default function CarListScreen({ navigation }: Props) {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);

  useEffect(() => {
    // Helper fonksiyon ile verileri çekiyoruz
    getIlanlar((rows) => {
      const arabaIlanlari = rows.filter((r) => r.kategori === "Araba");
      setIlanlar(arabaIlanlari);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ilanlar}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Resim */}
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : null}

            {/* Başlık */}
            <Text style={styles.title}>{item.baslik}</Text>

            {/* Konum */}
            <Text style={styles.location}>{item.konum}</Text>

            {/* Açıklama ve Fiyat */}
            <Text style={styles.desc}>{item.aciklama}</Text>
            <Text style={styles.price}>{item.fiyat} ₺</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  location: { fontSize: 12, color: "#555", marginVertical: 2 },
  desc: { fontSize: 14, color: "gray", marginVertical: 5 },
  price: { fontSize: 16, fontWeight: "600" },
});
