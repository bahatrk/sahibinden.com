
import { UserEntity } from "../database/userService";
import { api } from "./gateway";

export async function loginUser(email: string, password: string) {

  try {
      const res = await api
                .post<UserEntity>("/login", {
                  email: email,
                  password: password,
                });
      return { success: true, user:res.data };
    } catch (err: any) {
      return { success: false, message: err.detail};
    }
}
