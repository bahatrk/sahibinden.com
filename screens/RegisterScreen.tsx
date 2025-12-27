import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../navigation/authContext";
import {
  getUserByEmail,
  registerUserService,
  UserEntity,
} from "../lib/database/userService";
import AsyncStorage from "expo-sqlite/kv-store";
import { RootStackParamList } from "../navigation/types";
import { registerUserServiceApi } from "../lib/api/register";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);

  const registerUser = async () => {
    if (!name || !surname || !email || !password || !phone) {
      Alert.alert("Mistake", "Please fill in all fields.");
      return;
    }

    const result = await registerUserServiceApi(
      name,
      surname,
      email,
      password,
      phone
    );

    if (result.success && result.user) {
      await AsyncStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user);

      navigation.replace("Profile");
    } else {
      Alert.alert("Mistake", result.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* HomeScreen Dönüş */}
      <TouchableOpacity
        style={styles.homePageReturnButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Feather name="x" style={styles.homePageReturnIcon} />
      </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>Open an account</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={"gray"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email} // text inputun içeriğini state ile baglar
        onChangeText={setEmail} // text ınputa yazılan degerı state e aktarır
      />

      {/* Ad ve Soyad inputs */}
      <View style={styles.adSoyadInput}>
        <TextInput
          style={styles.halfInput}
          placeholder="Name"
          placeholderTextColor={"gray"}
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.halfInput}
          placeholder="Surname"
          placeholderTextColor={"gray"}
          autoCapitalize="none"
          value={surname}
          onChangeText={setSurname}
        />
      </View>

      {/* Telefon input */}
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor={"gray"}
        keyboardType="phone-pad" // numara klavyesi açılır
        value={phone}
        onChangeText={setPhone}
      />

      {/* Şifre input */}
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

      {/* Giriş Yap Butonu */}
      <TouchableOpacity style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Open an account</Text>
      </TouchableOpacity>

      <View style={styles.hesapAc}>
        <Text style={{ fontSize: 16 }}>Do you already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.hesapAcButton}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  adSoyadInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: "48%",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
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
    fontSize: 16,
    color: "black",
  },
});
