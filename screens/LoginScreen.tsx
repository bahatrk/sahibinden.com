import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import AsyncStorage from "expo-sqlite/kv-store"; // Keeping your import
import { AuthContext } from "../navigation/authContext";
// Import the new function
import { loginUser, getMyProfile } from "../lib/api/login"; 

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);

  const loginUserUI = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all the fields!");
      return;
    }

    // ADIM 1: Token Al (Login)
    const loginResult = await loginUser(email, password);

    if (!loginResult.success) {
      Alert.alert("Mistake", loginResult.message || "Login failed!");
      return;
    }

    // Token'ı kaydet (Gelecekteki API istekleri için)
    // Not: loginUser fonksiyonu içinde setAuthToken() çalıştığı için
    // API client şu an hazır. Token'ı telefona da kaydedelim:
    if (loginResult.token) {
        await AsyncStorage.setItem("token", loginResult.token);
    }

    // ADIM 2: Kullanıcı Bilgilerini Çek (/users/me)
    // Token artık elimizde olduğu için kim olduğumuzu sorabiliriz.
    const profileResult = await getMyProfile();

    if (profileResult.success && profileResult.user) {
      // User'ı telefona kaydet (Offline kullanım için vs)
      await AsyncStorage.setItem("user", JSON.stringify(profileResult.user));
      
      // Context'i güncelle
      setUser(profileResult.user);
      
      // Yönlendir
      navigation.replace("Profile");
    } else {
      Alert.alert("Mistake", "User information could not be retrieved.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      {/* ... (Rest of your UI stays exactly the same) ... */}
      
      {/* HomeScreen Dönüş */}
      <TouchableOpacity
        style={styles.homePageReturnButton}
        onPress={() => navigation.replace("Home")}
      >
        <Feather name="x" style={styles.homePageReturnIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Log in to post an ad.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={"gray"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.sifreContainer}>
        <TextInput
          style={styles.sifreInput}
          placeholder="Password"
          placeholderTextColor={"gray"}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? "eye-off" : "eye"} size={22} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={loginUserUI}>
        <Text style={styles.buttonText}>Log in with email</Text>
      </TouchableOpacity>

      <View style={styles.hesapAc}>
        <Text style={{ fontSize: 16 }}>Don't have an account yet?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.hesapAcButton}>Open an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles remain the same ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  homePageReturnButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  homePageReturnIcon: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 45,
    paddingHorizontal: 7.5,
  },
  input: {
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 45,
    backgroundColor: "#2E5894",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  hesapAc: {
    height: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
  },
  hesapAcButton: {
    color: "#007FFF",
    fontSize: 16,
  },
  sifreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
    fontSize: 16,
  },
  sifreInput: {
    flex: 1, // Added flex:1 to ensure input takes available space
    fontSize: 16,
    color: "black",
  },
});