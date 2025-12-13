import { openDb } from "../database/db";

export type UserEntity = {
  id: number;
  name: string;
  surname: string;
  email: string;
  password_hash: string;
  phone: string;
};

// Kullanıcı kaydı
export async function registerUserService(name: string, surname: string, email: string, password: string, phone: string): Promise<{ success: boolean; message?: string }> {
  const database = await openDb();

  try {
    await database.execAsync(
        `INSERT INTO user (name, surname, email, password_hash, phone)
        VALUES ('${name}', '${surname}', '${email}', '${password}' , '${phone}')`
    );

    return { success: true };
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return { success: false, message: "Bu email zaten kayıtlı!" };
    }
    console.log("Kayıt hatası:", err);
    return { success: false, message: "Kayıt yapılamadı!" };
  }
}

// Kullanıcıyı email ile çekmek
export async function getUserByEmail(email: string): Promise<UserEntity | null> {
  const db = await openDb();
  const user = await db.getAllAsync<UserEntity>(
    `SELECT * FROM user WHERE email = ?`,
    [email]
  );
  return user.length > 0 ? user[0] : null;
}

// LOGIN
export async function loginUserService(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) return { success: false, message: "Email bulunamadı!" };

  if (user.password_hash !== password)
    return { success: false, message: "Yanlış şifre!" };

  return { success: true, user };
}
