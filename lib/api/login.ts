import { api, setAuthToken } from "./gateway";

// Define what the Backend sends back now
interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function loginUser(email: string, password: string) {
  try {
    // 1. Post to login
    // Note: We expect TokenResponse, not UserEntity anymore
    const res = await api.post<TokenResponse>("/login", {
      email: email,
      password: password,
    });

    const token = res.data.access_token;

    // 2. IMPORTANT: Set the token in the API client
    setAuthToken(token);

    return { success: true, token: token };

  } catch (err: any) {
    console.error("Login failed", err);
    return { 
        success: false, 
        message: err.response?.data?.detail || "Login failed" 
    };
  }
}

export async function getMyProfile() {
  try {
    // This works because setAuthToken was called during login
    const res = await api.get("/login/user/me");
    return { success: true, user: res.data };
  } catch (err: any) {
    return { success: false, message: "Could not fetch profile" };
  }
}