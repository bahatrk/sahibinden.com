import React, { useContext, useEffect } from "react";
import { AuthContext } from "../navigation/authContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
  children: React.ReactNode;
};

export default function ProtectedRoute({ navigation, children }: Props) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigation.replace("Login"); // user yoksa otomatik Login ekranına yönlendir
    }
  }, [user]);

  if (!user) return null; // yönlendirme yapılırken boş render

  return <>{children}</>;
}
