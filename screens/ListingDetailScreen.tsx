import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import RealEstateDetailComponent from "../components/RealEstateDetailComponent";
import VehicleDetailComponent from "../components/VehicleDetailComponent";
import {
  RealEstateDetailEntity,
  RealEstateWithImagesOut,
  getRealEstateDetail,
} from "../lib/database/realEstateDetail";
import {
  VehicleDetailEntity,
  VehicleWithImagesOut,
  getVehicleDetail,
} from "../lib/database/vehicleDetail";
import { ListingWithData } from "../lib/database/listing";
import { RootStackParamList } from "../navigation/types";
import FavoriteButton from "../components/FavoriteButton";
import { AuthContext } from "../navigation/authContext";
import MessageActionBar from "../components/MessageActionBar";
import CallButton from "../components/CallButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchRealEstate } from "../lib/api/realEstate";
import { fetchVehicle } from "../lib/api/vehicle";

type ListingDetailRouteProp = RouteProp<RootStackParamList, "ListingDetail">;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const listing: ListingWithData = route.params.listing;
  const { user } = useContext(AuthContext); // login kullanıcı

  const insets = useSafeAreaInsets(); //tab ı aşmasın dıye 

  const [realEstateDetail, setRealEstateDetail] =
    useState<RealEstateWithImagesOut | null>(null);
  const [vehicleDetail, setVehicleDetail] =
    useState<VehicleWithImagesOut  | null>(null);

  useEffect(() => {
    loadDetail();
  }, []);

  // screens/ListingDetailScreen.tsx (sadece loadDetail fonksiyonunu değiştir)
  async function loadDetail() {
    try {
      console.log("loadDetail - listing:", listing);
      if (listing.category_type_id === 1) {
        const data = await fetchRealEstate(listing.id);
        console.log("loadDetail - RealEstateDetail API result:", data);
        setRealEstateDetail(data);
      } else if (listing.category_type_id === 2) {
        const data = await fetchVehicle(listing.id);
        console.log("loadDetail - VehicleDetail API result:", data);
        setVehicleDetail(data);
      } else {
        console.warn(
          "loadDetail - unknown category_type_id:",
          listing.category_type_id
        );
      }
    } catch (err) {
      console.error("loadDetail - error:", err);
    } finally {
    }
  }

  if (!realEstateDetail && !vehicleDetail) return <Text>Detay bulunamadı</Text>;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
      >
        {/* ===== Title + Favorite ===== */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", flex: 1 }}>
            {listing.title}
          </Text>

          {user && <FavoriteButton listingId={listing.id} userId={user.id} />}
        </View>

        {realEstateDetail && (
          <RealEstateDetailComponent detail={realEstateDetail} />
        )}

        {vehicleDetail && <VehicleDetailComponent detail={vehicleDetail} />}
      </ScrollView>

      {/* Mesaj ve Ara butonları, ilan sahibi göremez buunları */}
      {user?.id !== listing.user_id && (
        <View
          style={[
            styles.actionBar,
            { bottom: insets.bottom + 10 }, // 20px kadar yukarı taşıdık
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
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "absolute",
    left: 0,
    right: 0,
  },
});
