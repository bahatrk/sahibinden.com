import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { AuthContext } from "../navigation/authContext";
import {
  getMessages,
  sendMessage,
  MessageEntity,
} from "../lib/database/message";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const { conversationId, listing } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    const data = await getMessages(conversationId);
    setMessages(data);
    setLoading(false);
  }

  async function handleSend() {
    if (!text.trim() || !user) return;

    const messageText = text;
    setText("");

    if (!conversationId) {
      console.error("conversationId undefined!");
      return;
    }

    await sendMessage(conversationId, user.id, messageText);
    const updateMessages = await getMessages(conversationId);
    setMessages(updateMessages);
  }

  useEffect(() => {
    loadMessages();

    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  function renderItem({ item }: { item: MessageEntity }) {
    const isMe = item.sender_id === user?.id;

    return (
      <View
        style={[styles.message, isMe ? styles.myMessage : styles.theirMessage]}
      >
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* İlan başlığı */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {listing.title}
          </Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingTop: 10 }}
        />

        {/* INPUT */}
        <View style={[styles.inputBar, { paddingBottom: 8 }]}>
          <TextInput
            style={styles.input}
            placeholder="Mesaj yaz..."
            placeholderTextColor={"gray"}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  message: {
    maxWidth: "70%",
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  myMessage: {
    backgroundColor: "#DCF8C5",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 14,
  },
  time: {
    fontSize: 10,
    color: "gray",
    marginTop: 2,
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#104E8B",
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
