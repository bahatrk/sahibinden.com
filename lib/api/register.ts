import { UserEntity } from "../database/userService";
import { api } from "./gateway";

export async function registerUserServiceApi(
  name: string,
  surname: string,
  email: string,
  password: string,
  phone: string
): Promise<{ success: boolean; user?: UserEntity; message?: string }> {
  try {
    const res = await api.post("/users", { name, surname, email, password, phone });

    return { success: true, user:res.data, message: "Kayıt başarılı." };
  } catch (err: any) {
    console.log("Kayıt hatası:", err);
    return { success: false, message: err.response?.data?.detail || "Kayıt yapılamadı!" };
  }
}
