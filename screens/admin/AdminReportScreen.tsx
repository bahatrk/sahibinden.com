import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { fetchCategoryStats, CategoryStat } from "../../lib/api/admin";

const screenWidth = Dimensions.get("window").width;

export default function AdminReportScreen() {
  const [catStats, setCatStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const cData = await fetchCategoryStats();
    setCatStats(cData);
    setLoading(false);
  }

  if (loading) return <ActivityIndicator style={{marginTop: 50}} size="large" color="#2E5894" />;

  // Format Data for Pie Chart
  const pieData = catStats.map((item, index) => ({
    name: item.name,
    population: item.total_listings,
    color: index % 2 === 0 ? "#104E8B" : "#FF6347",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={styles.container}>
      
      {/* 2. Category Distribution Chart */}
      <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      {/* 3. Average Price List */}
      <Text style={styles.chartTitle}>Ortalama Fiyatlar (Root)</Text>
      {catStats.map((c) => (
          <View key={c.id} style={styles.row}>
              <Text>{c.name}</Text>
              <Text style={{fontWeight:'bold'}}>{c.average_price?.toLocaleString()} ₺</Text>
          </View>
      ))}

    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
  card: { backgroundColor: '#f0f0f0', width: '48%', padding: 20, borderRadius: 10, alignItems: 'center'},
  cardTitle: { fontSize: 14, color: '#666'},
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5},
  chartTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  row: { flexDirection:'row', justifyContent:'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee'}
});