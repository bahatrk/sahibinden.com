import { ConversationEntity } from "../database/conversation";
import { api } from "./gateway";

// Kullanıcının tüm konuşmaları
export async function getUserConversationsApi(userId: number) {
  try {
    const res = await api.get<ConversationEntity[]>(
      `/conversations/${userId}`
    );
    return res.data;
  } catch (err) {
    console.log("Conversation fetch error:", err);
    return [];
  }
}

export async function getOrCreateConversationApi(
  listingId: number,
  buyerId: number,
  sellerId: number
) {
  const res = await api.post<ConversationEntity>("/conversations", {
    listing_id: listingId,
    buyer_id: buyerId,
    seller_id: sellerId,
  });

  return res.data;
}
