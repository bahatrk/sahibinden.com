import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { fetchCategoryStats, CategoryStat } from "../../lib/api/admin";

const screenWidth = Dimensions.get("window").width;

// 1. Define a palette of distinct colors to cycle through
const CHART_COLORS = [
  "#104E8B", "#FF6347", "#FFD700", "#32CD32", "#8A2BE2", 
  "#00CED1", "#FF1493", "#FFA500", "#A52A2A", "#808080"
];

export default function AdminReportScreen() {
  const [catStats, setCatStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const cData = await fetchCategoryStats();
      setCatStats(cData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator style={{marginTop: 50}} size="large" color="#2E5894" />;

  // 2. Format Data for Pie Chart (Listing Count)
  const pieData = catStats.map((item, index) => ({
    name: item.name,
    population: item.total_listings,
    // Use modulo to cycle through the CHART_COLORS array safely
    color: CHART_COLORS[index % CHART_COLORS.length], 
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  // 3. Format Data for Bar Chart (Average Prices)
  const barChartData = {
    labels: catStats.map((c) => c.name), // You might want to truncate these if they are long
    datasets: [
      {
        data: catStats.map((c) => c.average_price || 0),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Chart 1: Pie Chart - Listing Distribution */}
      <Text style={styles.chartTitle}>Listing Distribution</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <View style={styles.separator} />

      {/* Chart 2: Bar Chart - Average Price Comparison */}
      <Text style={styles.chartTitle}>Average Price by Category</Text>
      
      {/* Use horizontal scroll for BarChart if there are many categories */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barChartData}
          width={Math.max(screenWidth - 20, catStats.length * 60)} // Dynamic width based on item count
          height={300}
          yAxisLabel="₺"
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            // distinct look for bar chart
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            fillShadowGradient: "#2E5894",
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(46, 88, 148, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            decimalPlaces: 0, 
          }}
          verticalLabelRotation={30} // Rotate labels to fit better
          fromZero
        />
      </ScrollView>

    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, 
  barPercentage: 0.7,
  useShadowColorFromDataset: false 
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10, color: "#333" },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 20 },
});