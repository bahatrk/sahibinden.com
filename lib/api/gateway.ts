// lib/api/api.ts
import axios from "axios";
import { BASE_URL } from "../../constant/apiConfig";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    // Apply to every request going forward
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Logout: Remove header
    delete api.defaults.headers.common["Authorization"];
  }
};

if (__DEV__) { 
  api.interceptors.response.use(
    async (response) => {
      // Başarılı yanıtlarda 2 saniye (2000ms) beklet
      console.log("⏳ Test Gecikmesi: 2 saniye bekleniyor...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return response;
    },
    async (error) => {
      // Hata durumlarında da 2 saniye beklet (Spinner'ı görmek için)
      console.log("⏳ Test Gecikmesi (Hata): 2 saniye bekleniyor...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return Promise.reject(error);
    }
  );
}
