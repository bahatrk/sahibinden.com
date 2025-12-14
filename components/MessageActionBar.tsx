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
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + 8 },
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>💬 Satıcıya Mesaj Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#104E8B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
