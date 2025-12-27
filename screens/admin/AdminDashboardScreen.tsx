import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { fetchAllUsers, deleteUserAsAdmin, fetchAllListingsAdmin } from "../../lib/api/admin";
import { UserEntity } from "../../lib/database/userService";
import AdminReportScreen from "./AdminReportScreen"; // <--- Import it

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<"users" | "listings" | "reports">("users");
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Only load Users/Listings here. Reports handles its own loading.
  useEffect(() => {
    if (activeTab !== "reports") {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const data = await fetchAllUsers();
        setUsers(data);
      } else if (activeTab === "listings") {
        const data = await fetchAllListingsAdmin();
        setListings(data);
      }
    } catch (e) {
      Alert.alert("Mistake", "failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    // ... (Keep your delete logic same as before)
     Alert.alert(
      "Delete User",
      `Are you sure you want to delete the user named ${userName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAsAdmin(userId);
              setUsers(users.filter((u) => u.id !== userId));
            } catch (e) {
              Alert.alert("Mistake", "Deletion failed.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === "users" && styles.activeTab]} 
            onPress={() => setActiveTab("users")}>
            <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === "listings" && styles.activeTab]} 
            onPress={() => setActiveTab("listings")}>
            <Text style={[styles.tabText, activeTab === "listings" && styles.activeTabText]}>Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === "reports" && styles.activeTab]} 
            onPress={() => setActiveTab("reports")}>
            <Text style={[styles.tabText, activeTab === "reports" && styles.activeTabText]}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT SWITCHER */}
      {activeTab === "reports" ? (
         // 1. Render Reports Component
         <AdminReportScreen />
      ) : (
         // 2. Render Users/Listings (Shared Loading Logic)
         loading ? (
           <ActivityIndicator size="large" color="#2E5894" style={{marginTop: 50}} />
         ) : (
           activeTab === "users" ? (
             <FlatList
               data={users}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => (
                 <View style={styles.itemCard}>
                   <View>
                     <Text style={styles.itemName}>{item.name} ({item.role})</Text>
                     <Text style={styles.itemSub}>{item.email}</Text>
                   </View>
                   {item.role !== 'admin' && (
                     <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item.id, item.name)}>
                       <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
                     </TouchableOpacity>
                   )}
                 </View>
               )}
             />
           ) : (
             <FlatList
               data={listings}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => (
                 <View style={styles.itemCard}>
                   <View>
                     <Text style={styles.itemName}>{item.title}</Text>
                     <Text style={styles.itemSub}>ID: {item.id} - {item.price} ₺</Text>
                   </View>
                 </View>
               )}
             />
           )
         )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f2f2" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" },
  tabContainer: { flexDirection: "row", marginBottom: 15 },
  tab: { flex: 1, padding: 10, alignItems: "center", borderBottomWidth: 2, borderColor: "#ccc" },
  activeTab: { borderColor: "#2E5894" },
  tabText: { color: "gray", fontWeight: "600" },
  activeTabText: { color: "#2E5894" },
  itemCard: { backgroundColor: "white", padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemSub: { color: "gray", fontSize: 12 },
  deleteBtn: { backgroundColor: "#d9534f", padding: 8, borderRadius: 5 },
});