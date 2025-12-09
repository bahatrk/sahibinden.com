import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { loginUserService } from "../lib/database/userService";
import AsyncStorage from "expo-sqlite/kv-store";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function LoginScreen( {navigation}: Props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const loginUser = async () => {
      if (!email || !password) {
        Alert.alert("Lütfen tüm alanları doldurun!");
        return;
      }

        const result = await loginUserService(email,password);

        if (result.success) {
          await AsyncStorage.setItem("user", JSON.stringify(result.user));
          navigation.replace("Profile");
        } else {
          Alert.alert("Hata", result.message || "Giriş yapılamadı!");
        }

        setEmail("");
        setPassword("");
    };

    return (
        <View style={styles.container}>

            {/* HomeScreen Dönüş */}
            <TouchableOpacity
                style={styles.homePageReturnButton}
                onPress={() => navigation.replace("Home")}
            >
                <Feather name="x" style={styles.homePageReturnIcon}/>
            </TouchableOpacity>
        
            {/* Başlık */}
            <Text style={styles.title}>İlan vermek için giriş yap</Text>

            {/* Email input */}
            <TextInput
                style={styles.input}
                placeholder="E-posta adresi"
                placeholderTextColor={"gray"}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Şifre input */}
            <View style={styles.sifreContainer}>
              <TextInput
                  style={styles.sifreInput}
                  placeholder="Şifre"
                  placeholderTextColor={"gray"}
                  secureTextEntry = {!showPassword}
                  value={password}
                  onChangeText={setPassword}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={22} />
              </TouchableOpacity>
            </View>

            {/* Giriş Yap Butonu */}
            <TouchableOpacity 
              style={styles.button}
              onPress={loginUser}
            >
                <Text style={styles.buttonText}>E-posta ile giriş yap</Text>
            </TouchableOpacity>

            <View style={styles.hesapAc}>
                <Text style={{fontSize: 16}}>Henüz hesabın yok mu? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.hesapAcButton}>Hesap aç</Text>
                </TouchableOpacity>
            </View>

        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  homePageReturnButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homePageReturnIcon:{
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 45,
    paddingHorizontal: 7.5
  },
  input: {
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 45,
    backgroundColor: '#2E5894',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  hesapAc: {
    height: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 60
  },
  hesapAcButton: {
    color: '#007FFF',
    fontSize: 16,
  },
  sifreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
    fontSize: 16,
  },
  sifreInput: {
    fontSize: 16,
    color: "black",
  }
});