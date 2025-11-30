import React , {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { openDatabaseSync } from "expo-sqlite";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  const registerUser = () => {
    if (!ad || !soyad || !email || !sifre) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const db = openDatabaseSync('sahibinden.db');

      db.execSync(
        `INSERT INTO users (ad, soyad, email, sifre) VALUES ('${ad}', '${soyad}', '${email}', '${sifre}');`
      );

      Alert.alert("Başarılı", "Kayıt oluşturuldu!");

      const result = db.getAllSync(`SELECT * FROM users`);
      console.log("Kayıtlı kullanıcılar:", result);

      // Kayıt sonrası login ekranına yönlendir
      navigation.navigate('Login');

      // Inputları temizle
      setAd("");
      setSoyad("");
      setEmail("");
      setSifre("");

    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        Alert.alert("Hata", "Bu email zaten kayıtlı!");
        // Inputları temizle
        setAd("");
        setSoyad("");
        setEmail("");
        setSifre("");
      } else {
        console.log("Kayıt hatası:", err);
        Alert.alert("Hata", "Kayıt yapılamadı!");
      }
    }
  };

  return (
    <View style={styles.container}>

      {/* HomeScreen Dönüş */}
      <TouchableOpacity
          style={styles.homePageReturnButton}
          onPress={() => navigation.navigate('Home')}
      >
          <Feather name="x" style={styles.homePageReturnIcon}/>
      </TouchableOpacity>
  
      {/* Başlık */}
      <Text style={styles.title}>Hesap aç</Text>

      {/* Email input */}
      <TextInput
          style={styles.input}
          placeholder="E-posta adresi"
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
              placeholder="Ad"
              placeholderTextColor={"gray"}
              autoCapitalize="none"
              value={ad}
              onChangeText={setAd}
          />

          <TextInput
              style={styles.halfInput}
              placeholder="Soyad"
              placeholderTextColor={"gray"}
              autoCapitalize="none"
              value={soyad}
              onChangeText={setSoyad}
          />
      </View>

      {/* Şifre input */}
      <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={"gray"}
          secureTextEntry
          value={sifre}
          onChangeText={setSifre}
      />

      {/* Giriş Yap Butonu */}
      <TouchableOpacity 
        style={styles.button}
        onPress={registerUser}
      >
          <Text style={styles.buttonText}>Hesap aç</Text>
      </TouchableOpacity>

      <View style={styles.hesapAc}>
          <Text style={{fontSize: 16}}>Zaten hesabın var mı? </Text>
          <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
          >
              <Text style={styles.hesapAcButton}>Giriş yap</Text>
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
  adSoyadInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: "48%",
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 7.5,
    marginBottom: 15,
    fontSize: 16,
},
});