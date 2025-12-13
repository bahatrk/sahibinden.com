import { createContext } from "react";
import { UserEntity } from "../lib/database/userService";

export type AuthContextType = {
  user: UserEntity | null;
  setUser: (user: UserEntity | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
