import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { fetchListingHistory, PriceHistoryItem } from "../../lib/api/listing";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  listingId: number;
};

export default function PriceHistory({ listingId }: Props) {
  const [history, setHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [listingId]);

  async function load() {
    const data = await fetchListingHistory(listingId);
    setHistory(data);
    setLoading(false);
  }

  if (loading) return <ActivityIndicator size="small" color="#aaa" />;
  
  // If no history, don't render anything
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price History</Text>
      
      {history.map((item, index) => {
        const isDrop = item.new_price < item.old_price;
        const diff = Math.abs(item.new_price - item.old_price);
        
        return (
          <View key={index} style={styles.row}>
            {/* 1. Date */}
            <View style={styles.dateCol}>
               <Text style={styles.dateText}>
                 {new Date(item.change_date).toLocaleDateString("tr-TR")}
               </Text>
            </View>

            {/* 2. Arrow Icon */}
            <Feather 
                name={isDrop ? "arrow-down-right" : "arrow-up-right"} 
                size={18} 
                color={isDrop ? "#28a745" : "#dc3545"} // Green for drop (Good for buyer), Red for rise
            />

            {/* 3. Prices */}
            <View style={styles.priceCol}>
                <Text style={styles.oldPrice}>{item.old_price.toLocaleString()} ₺</Text>
                <Text style={styles.newPrice}>{item.new_price.toLocaleString()} ₺</Text>
            </View>
            
            {/* 4. Difference Badge */}
            <View style={[styles.badge, { backgroundColor: isDrop ? "#e6fffa" : "#fff5f5" }]}>
                <Text style={[styles.badgeText, { color: isDrop ? "#28a745" : "#dc3545" }]}>
                    {isDrop ? "-" : "+"}{diff.toLocaleString()}
                </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  dateCol: { width: 80 },
  dateText: { fontSize: 12, color: "#888" },
  priceCol: { flex: 1, marginLeft: 10 },
  oldPrice: { 
    fontSize: 12, 
    color: "#aaa", 
    textDecorationLine: "line-through" 
  },
  newPrice: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#333" 
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold"
  }
});