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

type Props = {
  listing: ListingWithData;
};

export default function MessageActionBar({ listing }: Props) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  async function handlePress() {
    if (!user) {
      Alert.alert("Giriş gerekli", "Mesaj göndermek için giriş yapmalısın");
      return;
    }

    if (user.id === listing.user_id) {
      Alert.alert("Uyarı", "Kendi ilanına mesaj atamazsın");
      return;
    }

    try {
      const conversation = await getOrCreateConversation(
        listing.id,
        user.id, // buyer
        listing.user_id // seller
      );

      navigation.navigate("Chat", {
        conversationId: conversation.id,
        listing,
      });
    } catch (err) {
      Alert.alert("Hata", "Mesaj başlatılamadı");
    }
  }

  return (
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>💬 Satıcıya Mesaj Gönder</Text>
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
