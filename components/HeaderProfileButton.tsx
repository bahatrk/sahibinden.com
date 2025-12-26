import React, { useContext } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function HeaderProfileButton({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  const handleAdminPress = () => {
    // Navigate directly to the dashboard we created earlier
    navigation.navigate("AdminDashboard");
  };

  return (
    <View style={styles.container}>
      {/* CHECK: Is user logged in AND is their role 'admin'? 
         If yes, show the Shield icon.
      */}
      {user?.role === "admin" && (
        <TouchableOpacity 
          onPress={handleAdminPress} 
          style={styles.iconButton}
        >
          {/* 'shield' is a common icon for Admin/Security actions */}
          <Feather name="shield" size={24} color="#d9534f" /> 
        </TouchableOpacity>
      )}

      {/* Standard Profile Button */}
      <TouchableOpacity 
        onPress={handleProfilePress} 
        style={styles.iconButton}
      >
        <Feather name="user" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center',
    marginRight: 10,
  },
  iconButton: {
    paddingHorizontal: 8, // Adds clickable area and spacing between icons
  }
});