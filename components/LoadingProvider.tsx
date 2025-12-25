import React, { createContext, useState, useLayoutEffect, ReactNode } from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { api } from "../lib/api/gateway";

const LoadingContext = createContext<boolean>(false);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  useLayoutEffect(() => {
    // --- REQUEST INTERCEPTOR ---
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        setLoadingCount((prev) => prev + 1);
        return config;
      },
      (error) => {
        setLoadingCount((prev) => prev + 1);
        return Promise.reject(error);
      }
    );

    // --- RESPONSE INTERCEPTOR ---
    const resInterceptor = api.interceptors.response.use(
      (response) => {
        setLoadingCount((prev) => Math.max(0, prev - 1));
        return response;
      },
      (error) => {
        setLoadingCount((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={loadingCount > 0}>
      {children}
      {/* LoadingCount > 0 ise Loading Spinner'ı göster */}
      <LoadingOverlay visible={loadingCount > 0} />
    </LoadingContext.Provider>
  );
};

// --- GÜNCELLENMİŞ MODERN UI ---
const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  return (
    <Modal 
      transparent={true} 
      animationType="fade" 
      visible={visible}
      statusBarTranslucent={true} // Android'de status barın üzerini de kaplar
    >
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          {/* iOS ve Android'in kendi native dönen animasyonu */}
          <ActivityIndicator size="large" color="#3b82f6" /> 
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Arkaplanı hafif karartır (Dim Effect)
    justifyContent: "center", // Dikeyde ortalar
    alignItems: "center",     // Yatayda ortalar
  },
  loaderBox: {
    width: 80,
    height: 80,
    backgroundColor: "white", // Kutunun içi beyaz
    borderRadius: 16,         // Köşeleri yuvarlat
    justifyContent: "center",
    alignItems: "center",
    
    // --- GÖLGE EFEKTLERİ (Derinlik Hissi) ---
    elevation: 10,            // Android gölgesi
    shadowColor: "#000",      // iOS gölgesi
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});