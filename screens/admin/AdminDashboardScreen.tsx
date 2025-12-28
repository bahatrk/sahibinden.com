import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";

// Assuming you added restoreUserAsAdmin to your API
import { 
  fetchAllUsers, 
  deleteUserAsAdmin, 
  restoreUserAsAdmin, 
  fetchAllListingsAdmin 
} from "../../lib/api/admin";

import { UserEntity } from "../../lib/database/userService";
import AdminReportScreen from "./AdminReportScreen"; 

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<"users" | "listings" | "reports">("users");
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        // Ensure data includes 'is_active' field from backend
        setUsers(data);
      } else if (activeTab === "listings") {
        const data = await fetchAllListingsAdmin();
        setListings(data);
      }
    } catch (e) {
      Alert.alert("Mistake", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- ADAPTED FUNCTIONALITY HERE ---
  const handleUserAction = (user: UserEntity) => {
    // 1. Determine Current Status (Default to true if undefined)
    const isActive = user.is_active !== false; 

    // 2. Define Text based on Status
    const title = isActive ? "Ban User (Deactivate)" : "Unban User (Restore)";
    const message = isActive 
      ? `Are you sure you want to deactivate ${user.name}? They will not be able to login.` 
      : `Are you sure you want to restore ${user.name}? They will be able to login again.`;
    
    const actionText = isActive ? "Deactivate" : "Restore";
    const actionStyle = isActive ? "destructive" : "default";

    // 3. Show Alert
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText,
          style: actionStyle,
          onPress: async () => {
            try {
              let success = false;
              
              // 4. Call appropriate API
              if (isActive) {
                 await deleteUserAsAdmin(user.id);
                 success = true; // Assuming API throws error if fails, otherwise check response
              } else {
                 await restoreUserAsAdmin(user.id); 
                 success = true;
              }

              if (success) {
                // 5. Update Local State (Toggle is_active instead of removing)
                setUsers((prevUsers) => 
                  prevUsers.map((u) => 
                    u.id === user.id ? { ...u, is_active: !isActive } : u
                  )
                );
              }

            } catch (e) {
              Alert.alert("Mistake", "Operation failed.");
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: UserEntity }) => {
    // Check status
    const isActive = item.is_active !== false;

    return (
      <View style={[styles.itemCard, !isActive && styles.itemCardInactive]}>
        <View style={{flex: 1}}>
          <Text style={[styles.itemName, !isActive && styles.textInactive]}>
            {item.name} 
            {!isActive && " (Banned)"}
          </Text>
          <Text style={styles.itemSub}>
            {item.email} • {item.role}
          </Text>
        </View>

        {/* Action Button */}
        {item.role !== 'admin' && (
          <TouchableOpacity 
            style={[styles.actionBtn, isActive ? styles.btnDelete : styles.btnRestore]} 
            onPress={() => handleUserAction(item)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {isActive ? "Ban" : "Restore"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
         <AdminReportScreen />
      ) : (
         loading ? (
           <ActivityIndicator size="large" color="#2E5894" style={{marginTop: 50}} />
         ) : (
           activeTab === "users" ? (
             <FlatList
               data={users}
               keyExtractor={(item) => item.id.toString()}
               renderItem={renderUserItem}
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
  
  // Item Styles
  itemCard: { 
    backgroundColor: "white", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    elevation: 2 
  },
  itemCardInactive: {
    backgroundColor: "#e0e0e0", // Gray background for inactive users
    opacity: 0.8
  },
  itemName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  textInactive: { color: "#777", textDecorationLine: "line-through" }, // Strikethrough for name
  itemSub: { color: "gray", fontSize: 12 },
  
  // Button Styles
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
  btnDelete: { backgroundColor: "#d9534f" }, // Red
  btnRestore: { backgroundColor: "#28a745" }, // Green
});