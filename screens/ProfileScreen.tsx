import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AsyncStorage from "expo-sqlite/kv-store";
import {
  deleteListing,
  getUserListings,
  ListingWithData,
} from "../lib/database/listing";
import { getUserFavorites } from "../lib/database/favorite";
import FavoriteButton from "../components/FavoriteButton";
import UserInfoCard from "../components/UserInfoCard";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type Section = "menu" | "info" | "listings" | "favorites";

export default function ProfileScreen({ navigation }: Props) {
  const { user, setUser } = useContext(AuthContext);
  const [myListings, setMyListings] = useState<ListingWithData[]>([]);
  const [myFavorites, setMyFavorites] = useState<ListingWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<Section>("menu");

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
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (section === "favorites" && user?.id) {
        try {
          const favs = await getUserFavorites(user.id);
          setMyFavorites(favs);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchFavorites();
  }, [section, user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    navigation.replace("Home");
  };

  const handleDeleteListing = async (listingId: number) => {
    Alert.alert("Sil", "Bu ilanı silmek istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await deleteListing(listingId);
          setMyListings((prev) => prev.filter((l) => l.id !== listingId));
        },
      },
    ]);
  };

  const renderListingItem = ({
    item,
    showFavorite = false,
  }: {
    item: ListingWithData;
    showFavorite?: boolean;
  }) => (
    <View style={styles.listingItem}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.listingImage} />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text>{item.price} TL</Text>
        <Text>
          {item.location_province} - {item.location_district}
        </Text>
      </View>

      {section === "listings" && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteListing(item.id)}
        >
          <Text style={{ color: "#fff" }}>Sil</Text>
        </TouchableOpacity>
      )}

      {showFavorite && (
        <FavoriteButton listingId={item.id} userId={user!.id} size={22} />
      )}
    </View>
  );

  const renderList = (data: ListingWithData[], showFavorite: boolean) => {
    if (loading) return <ActivityIndicator size="large" color="#104E8B" />;

    if (data.length === 0)
      return (
        <View>
          <Text>Henüz ilan yok.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSection("menu")}
          >
            <Text style={{ color: "#fff" }}>Geri</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(props) => renderListingItem({ ...props, showFavorite })}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSection("menu")}
          >
            <Text style={{ color: "#fff" }}>Geri</Text>
          </TouchableOpacity>
        }
      />
    );
  };

  return (
    <ProtectedRoute navigation={navigation}>
      <View style={{ flex: 1, padding: 12 }}>
        <Text style={styles.header}>Hoşgeldin, {user?.name}!</Text>

        {section === "menu" && (
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("info")}
            >
              <Text style={styles.menuText}>Kullanıcı Bilgilerim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("listings")}
            >
              <Text style={styles.menuText}>İlanlarım</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("favorites")}
            >
              <Text style={styles.menuText}>Favorilerim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
              <Text style={styles.menuText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        )}

        {section === "info" && user && (
          <View style={{ marginTop: 12 }}>
            <UserInfoCard
              name={user.name}
              surname={user.surname}
              email={user.email}
              phone={user.phone}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSection("menu")}
            >
              <Text style={{ color: "#fff" }}>Geri</Text>
            </TouchableOpacity>
          </View>
        )}

        {section === "listings" && renderList(myListings, false)}
        {section === "favorites" && renderList(myFavorites, true)}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  subHeader: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  listingItem: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  listingImage: { width: 80, height: 80, borderRadius: 8 },
  listingTitle: { fontSize: 16, fontWeight: "500" },
  deleteButton: {
    backgroundColor: "#2E5894",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  menuButton: {
    padding: 12,
    backgroundColor: "#2E5894",
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  menuText: { color: "#fff", fontWeight: "bold" },
  backButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#2E5894",
    borderRadius: 8,
    alignItems: "center",
  },
});
