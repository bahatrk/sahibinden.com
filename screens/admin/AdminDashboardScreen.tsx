import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { fetchAllUsers, deleteUserAsAdmin, fetchAllListingsAdmin } from "../../lib/api/admin";
import { UserEntity } from "../../lib/database/userService";

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [listings, setListings] = useState<any[]>([]); // Use your Listing Type

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "users") {
        const data = await fetchAllUsers();
        setUsers(data);
      } else {
        const data = await fetchAllListingsAdmin();
        setListings(data);
      }
    } catch (e) {
      Alert.alert("Hata", "Veri yüklenemedi");
    }
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    Alert.alert(
      "Kullanıcıyı Sil",
      `${userName} isimli kullanıcıyı ve TÜM ilanlarını silmek istediğine emin misin? Bu işlem geri alınamaz.`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil (Yönetici)",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAsAdmin(userId);
              setUsers(users.filter((u) => u.id !== userId));
              Alert.alert("Başarılı", "Kullanıcı silindi.");
            } catch (e) {
              Alert.alert("Hata", "Silme işlemi başarısız.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yönetici Paneli</Text>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === "users" && styles.activeTab]}
            onPress={() => setActiveTab("users")}
        >
            <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Kullanıcılar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === "listings" && styles.activeTab]}
            onPress={() => setActiveTab("listings")}
        >
             <Text style={[styles.tabText, activeTab === "listings" && styles.activeTabText]}>Tüm İlanlar</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      {activeTab === "users" ? (
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
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteUser(item.id, item.name)}
                  >
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Yasakla/Sil</Text>
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
                 <Text style={styles.itemSub}>ID: {item.id} - Fiyat: {item.price}</Text>
              </View>
              {/* Add Listing Delete Logic Here similar to User Delete */}
            </View>
          )}
        />
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
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemSub: { color: "gray", fontSize: 12 },
  deleteBtn: { backgroundColor: "#d9534f", padding: 8, borderRadius: 5 }
});