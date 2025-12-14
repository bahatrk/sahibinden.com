import { ConversationEntity } from "./conversation";
import { openDb } from "./db";

export type MessageEntity = {
  id: number;
  conversation_id: number;
  sender_id: number;
  text: string;
  is_read: number;
  created_at: number;
};

export async function getMessages(
  conversationId: number
): Promise<MessageEntity[]> {
  const db = await openDb();

  const rows = await db.getAllAsync<MessageEntity>(
    `SELECT *
     FROM message
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    [conversationId]
  );

  return rows ?? [];
}

export async function sendMessage(
  conversationId: number,
  senderId: number,
  text: string
) {
  const db = await openDb();
  const createdAt = Date.now();

  // Mesaj ekle
  await db.runAsync(
    `INSERT INTO message
     (conversation_id, sender_id, text, is_read, created_at)
     VALUES (?, ?, ?, 0, ?)`,
    [conversationId, senderId, text, createdAt]
  );

  // Son eklenen mesajın id'sini al
  const row = await db.getFirstAsync<{ id: number }>(
    `SELECT last_insert_rowid() as id`
  );

  console.log("Message inserted, id:", row?.id);

  return row?.id;
}

//satıcının mesajlarım ekranı
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
      ) AS last_message
    FROM conversation c
    JOIN listing l ON l.id = c.listing_id
    WHERE c.seller_id = ? OR c.buyer_id = ?
    ORDER BY c.created_at DESC
  `;

  return (
    (await db.getAllAsync<ConversationEntity>(sql, [userId, userId])) ?? []
  );
}
