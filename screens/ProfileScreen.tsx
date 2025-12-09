import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "expo-sqlite/kv-store";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../navigation/RootNavigator";


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
    navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.navigate("Home");
  };

  if (!user) return null;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Hoşgeldin, {user.name}!
      </Text>
      <Text>Email: {user.email}</Text>

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
  );
}
