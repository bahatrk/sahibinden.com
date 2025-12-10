import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AsyncStorage from "expo-sqlite/kv-store";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
    navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // AsyncStorage temizle
    setUser(null); // global state temizle
    navigation.replace("Home"); // Home’a yönlendir
  };

  return (
    <ProtectedRoute navigation={navigation}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Hoşgeldin, {user?.name}!
        </Text>
        <Text>Email: {user?.email}</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#FF4D4D",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}
