import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function HeaderProfileButton({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  const handlePress = () => {
    if (user) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginRight: 15 }}>
      <Feather name="user" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
