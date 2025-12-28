import { MessageEntity } from "../database/message";
import { api } from "./gateway";

export async function getMessagesApi(conversationId: number) {
  const res = await api.get<MessageEntity[]>(
    `/messages/${conversationId}`
  );
  return res.data;
}

export async function sendMessageApi(
  conversationId: number,
  senderId: number,
  text: string
) {
  const res = await api.post<MessageEntity>("/messages", {
    conversation_id: conversationId,
    sender_id: senderId,
    text,
  });

  return res.data;
}