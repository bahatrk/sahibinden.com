import { createContext } from "react";
import { UserEntity } from "../lib/database/userService";

export type AuthContextType = {
  user?: UserEntity ;
  setUser: (user?: UserEntity) => void;
};

export const AuthContext = createContext<AuthContextType>({
  setUser: () => {},
});
