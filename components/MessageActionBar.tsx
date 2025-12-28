import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ListingWithData } from "../lib/database/listing";
import { AuthContext } from "../navigation/authContext";
import { getOrCreateConversation } from "../lib/database/conversation";
import { getOrCreateConversationApi } from "../lib/api/conversation";

type Props = {
  listing: ListingWithData;
};

export default function MessageActionBar({ listing }: Props) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  async function handlePress() {
    if (!user) {
      Alert.alert("Login required", "You must log in to send a message.");
      return;
    }

    if (user.id === listing.user_id) {
      Alert.alert("Warning", "You can't post a message to your own ad.");
      return;
    }

    try {
      const conversation = await getOrCreateConversationApi(
        listing.id,
        user.id, // buyer
        listing.user_id // seller
      );

      navigation.navigate("Chat", {
        conversationId: conversation.id,
        listing,
      });
    } catch (err) {
      Alert.alert("Mistake", "Failed to initialize message");
    }
  }

  return (
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>💬 Send Message to Seller</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4, 
    backgroundColor: "#104E8B"
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
