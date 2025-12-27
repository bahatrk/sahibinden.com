import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import RealEstateDetailComponent from "../components/RealEstateDetailComponent";
import VehicleDetailComponent from "../components/VehicleDetailComponent";
import FavoriteButton from "../components/FavoriteButton";
import MessageActionBar from "../components/MessageActionBar";
import CallButton from "../components/CallButton";
import PriceHistory from "../components/listing/PriceHistory"; // <--- 1. Import New Component

// Data / API
import {
  RealEstateWithImagesOut,
  fetchRealEstate,
} from "../lib/api/realEstate";
import {
  VehicleWithImagesOut,
  fetchVehicle,
} from "../lib/api/vehicle";
import { ListingWithData } from "../lib/database/listing";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";

type ListingDetailRouteProp = RouteProp<RootStackParamList, "ListingDetail">;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const listing: ListingWithData = route.params.listing;
  const { user } = useContext(AuthContext); 
  const insets = useSafeAreaInsets();

  const [realEstateDetail, setRealEstateDetail] = useState<RealEstateWithImagesOut | null>(null);
  const [vehicleDetail, setVehicleDetail] = useState<VehicleWithImagesOut | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    try {
      if (listing.category_type_id === 1) {
        const data = await fetchRealEstate(listing.id);
        setRealEstateDetail(data);
      } else if (listing.category_type_id === 2) {
        const data = await fetchVehicle(listing.id);
        setVehicleDetail(data);
      }
    } catch (err) {
      console.error("loadDetail - error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator style={{marginTop: 50}} size="large" color="#2E5894" />;
  if (!realEstateDetail && !vehicleDetail) return <Text style={{padding: 20}}>No details found</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }} // Increased bottom padding for action bar
      >
        {/* ===== Title + Favorite ===== */}
        <View style={styles.headerRow}>
          <Text style={styles.titleText}>{listing.title}</Text>
          {user && <FavoriteButton listingId={listing.id} userId={user.id} />}
        </View>

        {/* ===== Specific Details (Images, Attributes, Description) ===== */}
        {realEstateDetail && (
          <RealEstateDetailComponent detail={realEstateDetail} />
        )}

        {vehicleDetail && (
            <VehicleDetailComponent detail={vehicleDetail} />
        )}
        
        {/* ===== PRICE HISTORY SECTION ===== */}
        {/* 2. Added Here: Shows only if there is history */}
        <View style={{ marginTop: 20 }}>
            <PriceHistory listingId={listing.id} />
        </View>

      </ScrollView>

      {/* ===== Action Buttons (Only for non-owners) ===== */}
      {user?.id !== listing.user_id && (
        <View
          style={[
            styles.actionBar,
            { bottom: insets.bottom + 10 },
          ]}
        >
          <CallButton phone={listing.user_phone} />
          <MessageActionBar listing={listing} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 10
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "absolute",
    left: 0,
    right: 0,
  },
});