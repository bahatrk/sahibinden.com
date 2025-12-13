import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AsyncStorage from "expo-sqlite/kv-store";
import { getUserListings, ListingWithData } from "../lib/database/listing";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, setUser } = useContext(AuthContext);
  const [myListings, setMyListings] = useState<ListingWithData[]>([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcı ilanlarını yükle
  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (user?.id) {
          const listings = await getUserListings(user.id);
          setMyListings(listings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // yükleme tamamlandı
      }
    };

    fetchListings();
  }, [user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // AsyncStorage temizle
    setUser(null); // global state temizle
    navigation.replace("Home"); // Home’a yönlendir
  };

  return (
    <ProtectedRoute navigation={navigation}>
      <View style={{ flex: 1, padding: 12 }}>
        <Text style={styles.header}>Hoşgeldin, {user?.name}!</Text>
        <Text>Email: {user?.email}</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.subHeader}>İlanlarım</Text>

          {loading ? (
            <Text>Yükleniyor...</Text>
          ) : myListings.length === 0 ? (
            <Text>Henüz ilan yok.</Text>
          ) : (
            <FlatList
              data={myListings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listingItem}>
                  {item.image_url && (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.listingImage}
                    />
                  )}
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text>{item.price} TL</Text>
                    <Text>
                      {item.location_province} - {item.location_district}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  subHeader: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  logoutButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FF4D4D",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  listingItem: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  listingImage: { width: 80, height: 80, borderRadius: 8 },
  listingTitle: { fontSize: 16, fontWeight: "500" },
});
