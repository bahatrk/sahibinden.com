import { openDb } from "./db";

export type ConversationEntity = {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  created_at: number;

  // JOIN ile gelecek alanlar
  listing_title?: string;
  last_message?: string;
  last_message_time?: number;
};

export async function getOrCreateConversation(
  listingId: number,
  buyerId: number,
  sellerId: number
): Promise<ConversationEntity> {
  const db = await openDb();

  // VAR MI?
  const existing = await db.getFirstAsync<ConversationEntity>(
    `SELECT * FROM conversation
     WHERE listing_id = ? AND buyer_id = ?`,
    [listingId, buyerId]
  );

  if (existing) return existing;

  // YOKSA OLUŞTUR
  const result: any = await db.runAsync(
    `INSERT INTO conversation
     (listing_id, buyer_id, seller_id, created_at)
     VALUES (?, ?, ?, ?)`,
    [listingId, buyerId, sellerId, Date.now()]
  );

  console.log("Conversation insert result:", result); // <--- Bunu logla

  const conversationId = result?.lastID ?? result?.insertId;
  if (!conversationId) throw new Error("Conversation insertId bulunamadı!");

  return {
    id: conversationId,
    listing_id: listingId,
    buyer_id: buyerId,
    seller_id: sellerId,
    created_at: Date.now(),
  };
}

export async function getUserConversations(
  userId: number
): Promise<ConversationEntity[]> {
  const db = await openDb();

  const sql = `
    SELECT
      c.*,
      l.title AS listing_title,
      (
        SELECT text
        FROM message m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message,
      (
        SELECT created_at
        FROM message m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message_time
    FROM conversation c
    JOIN listing l ON l.id = c.listing_id
    WHERE c.seller_id = ? OR c.buyer_id = ?
    ORDER BY last_message_time DESC
  `;

  return (
    (await db.getAllAsync<ConversationEntity>(sql, [userId, userId])) ?? []
  );
}
