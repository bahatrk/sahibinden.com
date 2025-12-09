import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import RealEstateDetailComponent from "../components/RealEstateDetailComponent";
import { RealEstateDetailEntity } from "../lib/database/realEstateDetail";
import { getRealEstateDetail } from "../lib/database/realEstateDetail";
import { ListingWithData } from "../lib/database/listing";
import { RootStackParamList } from "../navigation/RootNavigator";

type ListingDetailRouteProp = RouteProp<RootStackParamList, "ListingDetail">;

export default function ListingDetailScreen() {
  const route = useRoute<ListingDetailRouteProp>();
  const listing: ListingWithData = route.params.listing;

  const [detail, setDetail] = useState<RealEstateDetailEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    const data = await getRealEstateDetail(listing.id);
    setDetail(data);
    setLoading(false);
  }

  if (loading) return <ActivityIndicator size="large" color="#104E8B" />;

  if (!detail) return <Text>Detay bulunamadı</Text>;

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>{listing.title}</Text>
      <RealEstateDetailComponent detail={detail} />
    </ScrollView>
  );
}
