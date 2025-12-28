import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { searchListings } from "../lib/api/listing";
import { ListingWithData } from "../lib/database/listing";
import ListingItem from "../components/ListingItem"; // Using your existing component!

type ScreenRouteProp = RouteProp<RootStackParamList, "SearchResults">;

export default function SearchResultsScreen() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { query } = route.params;

  const [results, setResults] = useState<ListingWithData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic Header Title
    navigation.setOptions({ title: `Results of "${query}"` });
    
    async function doSearch() {
      const data = await searchListings(query);
      setResults(data);
      setLoading(false);
    }
    doSearch();
  }, [query]);

  if (loading) return <ActivityIndicator style={{marginTop: 50}} size="large" color="#2E5894" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <ListingItem 
            listing={item}
            onPress={() => navigation.navigate("ListingDetail", { listing: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50, color: "#666" }}>
            No results found.
          </Text>
        }
      />
    </View>
  );
}