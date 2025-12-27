import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AsyncStorage from "expo-sqlite/kv-store";
import { ListingWithData } from "../lib/database/listing";
import FavoriteButton from "../components/FavoriteButton";
import UserInfoCard from "../components/UserInfoCard";
import {
  getUserConversations,
  ConversationEntity,
} from "../lib/database/conversation";
import { deleteListingApi, fetchFullListingDetails, fetchListingsByUser } from "../lib/api/listing";
import { fetchUserFavorites } from "../lib/api/favorite";
import { getUserConversationsApi } from "../lib/api/conversation";
import { DEFAULT_IMAGE, getImageUrl } from "../constant/apiConfig";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type Section = "menu" | "info" | "listings" | "favorites" | "messages";

export default function ProfileScreen({ navigation }: Props) {
  const { user, setUser } = useContext(AuthContext);
  const [myListings, setMyListings] = useState<ListingWithData[]>([]);
  const [myFavorites, setMyFavorites] = useState<ListingWithData[]>([]);
  const [conversations, setConversations] = useState<ConversationEntity[]>([]);
  const [section, setSection] = useState<Section>("menu");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (user?.id) {
          const listings = await fetchListingsByUser(user.id);
          setMyListings(listings);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    fetchListings();
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (section === "favorites" && user?.id) {
        try {
          const favs = await fetchUserFavorites(user.id);
          setMyFavorites(favs);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchFavorites();
  }, [section, user]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (section === "messages" && user?.id) {
        try {
          const convs = await getUserConversationsApi(user.id);
          setConversations(convs);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchConversations();
  }, [section, user]);

  const handleLogout = async () => {
    try {
      //AsyncStorage'dan kullanıcıyı sil
      await AsyncStorage.removeItem("user");
      setUser(undefined);
      navigation.replace("Home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    Alert.alert("Delete", "Are you sure you want to delete this ad?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await deleteListingApi(listingId);
            if (response.success) {
              setMyListings((prev) => prev.filter((l) => l.id !== listingId));
            } else {
              Alert.alert("Mistake", response.message);
            }
          } catch (err) {
            Alert.alert("Mistake", "An error occurred while deleting the listing.");
          }
        },
      },
    ]);
  };

  const handleEditPress = async (listingId: number) => {
    try {
      const fullData = await fetchFullListingDetails(listingId);
      // Navigate to the SPECIFIC Update Screen
      navigation.navigate("UpdateListing", { listing: fullData });
    } catch (e) {
      Alert.alert("Mistake");
    }
  }

  const renderListingItem = ({
    item,
    showFavorite = false,
  }: {
    item: ListingWithData;
    showFavorite?: boolean;
  }) => (
    <View style={styles.listingItem}>
      {item.image_url && (
        <Image
          source={{
            uri: item.image_url ? getImageUrl(item.image_url) : DEFAULT_IMAGE,
          }}
          style={styles.listingImage}
        />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text>{item.price} TL</Text>
        <Text>
          {item.city_name}
          {"\n"}
          {item.district_name}
          {"\n"}
          {item.neighbourhood_name}
        </Text>
      </View>

      {/* ACTION BUTTONS */}
      {section === "listings" && (
        <View style={{ alignItems: 'flex-end' }}>
          
          
          {/* EDIT BUTTON */}
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: "#FFA500", marginBottom: 5 }]} // Orange for edit
            onPress={() => handleEditPress(item.id)}
          >
            <Text style={{ color: "#fff" }}>Edit</Text>
          </TouchableOpacity>

          {/* DELETE BUTTON */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteListing(item.id)}
          >
            <Text style={{ color: "#fff" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ... Favorite Button logic ... */}
      {showFavorite && user && (
        <FavoriteButton
          listingId={item.id}
          userId={user.id}
          size={22}
          onToggle={async (removed) => {
            if (removed) {
              setMyFavorites((prev) => prev.filter((l) => l.id !== item.id));
            } else {
              const updatedFavorites = await fetchUserFavorites(user.id);
              setMyFavorites(updatedFavorites);
            }
          }}
        />
      )}
    </View>
);

  const renderConversationItem = ({ item }: { item: ConversationEntity }) => (
    <TouchableOpacity
      style={styles.listingItem}
      onPress={() =>
        navigation.navigate("Chat", {
          conversationId: item.id,
          listing: {
            id: item.listing_id,
            title: item.listing_title || "Ad",
            user_id: item.seller_id,
          } as ListingWithData,
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.listingTitle}>{item.listing_title}</Text>
        <Text numberOfLines={1}>{item.last_message || "No message"}</Text>
      </View>
      <Text style={{ color: "gray", fontSize: 12 }}>
        {item.last_message_time
          ? new Date(item.last_message_time).toLocaleTimeString()
          : ""}
      </Text>
    </TouchableOpacity>
  );

  const renderList = (data: ListingWithData[], showFavorite: boolean) => {

    if (data.length === 0)
      return (
        <View>
          <Text>No announcement yet.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSection("menu")}
          >
            <Text style={{ color: "#fff" }}>Back</Text>
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
            <Text style={{ color: "#fff" }}>Back</Text>
          </TouchableOpacity>
        }
      />
    );
  };

  const renderConversations = () => {

    if (conversations.length === 0)
      return (
        <View>
          <Text>No messages yet.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSection("menu")}
          >
            <Text style={{ color: "#fff" }}>Back</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderConversationItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSection("menu")}
          >
            <Text style={{ color: "#fff" }}>Back</Text>
          </TouchableOpacity>
        }
      />
    );
  };

  return (
    <ProtectedRoute navigation={navigation}>
      <View style={{ flex: 1, padding: 12 }}>
        <Text style={styles.header}>Welcome, {user?.name}!</Text>

        {section === "menu" && (
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("info")}
            >
              <Text style={styles.menuText}>My User Information</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("listings")}
            >
              <Text style={styles.menuText}>My Listings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("favorites")}
            >
              <Text style={styles.menuText}>My Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSection("messages")}
            >
              <Text style={styles.menuText}>My Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
              <Text style={styles.menuText}>Log Out</Text>
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
              <Text style={{ color: "#fff" }}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {section === "listings" && renderList(myListings, false)}
        {section === "favorites" && renderList(myFavorites, true)}
        {section === "messages" && renderConversations()}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
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
