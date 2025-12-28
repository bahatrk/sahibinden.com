import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "expo-sqlite/kv-store"; // Ensure this matches your installed package
import { UserEntity } from "../lib/database/userService";
import { setAuthToken } from "../lib/api/gateway";

export type AuthContextType = {
  user?: UserEntity;
  setUser: (user?: UserEntity) => void;
  loading: boolean;        // Tells us if we are still checking storage
  logout: () => Promise<void>; // Helper to clear everything
};

// Default values
export const AuthContext = createContext<AuthContextType>({
  setUser: () => {},
  loading: true,
  logout: async () => {},
});

// --- THE PROVIDER COMPONENT ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserEntity | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // 1. Run once on App Start
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      // Load data from phone disk
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedUser && storedToken) {
        // A. Restore User object
        setUserState(JSON.parse(storedUser));
        
        // B. Restore API Token (CRITICAL for backend calls)
        setAuthToken(storedToken); 
      }
    } catch (e) {
      console.error("Failed to load user", e);
    } finally {
      // Whether found or not, we are done loading
      setLoading(false);
    }
  }

  // 2. Helper to set user AND save to storage
  const setUser = async (newUser?: UserEntity) => {
    if (newUser) {
       setUserState(newUser);
       // Token should be saved separately in Login screen usually, 
       // but we save User object here to be safe.
       await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } else {
       logout();
    }
  };

  // 3. Helper to Logout
  const logout = async () => {
    setUserState(undefined);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setAuthToken(null); // Clear API header
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};