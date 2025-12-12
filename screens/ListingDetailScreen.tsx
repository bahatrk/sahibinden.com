import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import RealEstateDetailComponent from "../components/RealEstateDetailComponent";
import VehicleDetailComponent from "../components/VehicleDetailComponent";
import { RealEstateDetailEntity, getRealEstateDetail } from "../lib/database/realEstateDetail";
import { VehicleDetailEntity, getVehicleDetail } from "../lib/database/vehicleDetail";
import { ListingWithData } from "../lib/database/listing";
import { RootStackParamList } from "../navigation/types";

type ListingDetailRouteProp = RouteProp<RootStackParamList, "ListingDetail">;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const listing: ListingWithData = route.params.listing;

  const [realEstateDetail, setRealEstateDetail] =
    useState<RealEstateDetailEntity | null>(null);
  const [vehicleDetail, setVehicleDetail] =
    useState<VehicleDetailEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  // screens/ListingDetailScreen.tsx (sadece loadDetail fonksiyonunu değiştir)
  async function loadDetail() {
    try {
      console.log("loadDetail - listing:", listing);
      if (listing.category_type_id === 1) {
        const data = await getRealEstateDetail(listing.id);
        console.log("loadDetail - RealEstateDetail result:", data);
        setRealEstateDetail(data);
      } else if (listing.category_type_id === 2) {
        const data = await getVehicleDetail(listing.id);
        console.log("loadDetail - VehicleDetail result:", data);
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
      // loading her durumda kapat
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#104E8B" />;

  if (!realEstateDetail && !vehicleDetail) return <Text>Detay bulunamadı</Text>;

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        {listing.title}
      </Text>

      {realEstateDetail && (
        <RealEstateDetailComponent detail={realEstateDetail} />
      )}

      {vehicleDetail && <VehicleDetailComponent detail={vehicleDetail} />}
    </ScrollView>
  );
}
