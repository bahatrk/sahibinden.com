import React from "react";
import { View, Text, StyleSheet, TextInput,TouchableOpacity} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";

// uygulamada belırledıgımız stack navigator tipi ve RootStackParamList tüm stack ekranlarını ve onlara gönderilecek parametreleri tanımlar
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>; 

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({navigation}: Props){
    return (
        <View style={styles.container}>

            {/* Arama Barı */}
            <TextInput
                style={styles.searchBar}
                placeholder="Araba, ev ara..."
                placeholderTextColor={'black'}
            />

            {/* Kategoriler Başlığı */}
            <Text style={styles.title}>Kategoriler</Text>

            <View style={styles.categoriesContainer}>
                 <View style={styles.categoryWrapper}>
                    {/* Emlak Butonu */}
                    <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => navigation.navigate('RealEstateList')}
                    >
                        <View style={{backgroundColor: 'orange', borderRadius: '50%', padding: 10}}>
                            <Entypo name="home" size={24} color="white" />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.buttonTitleText}>Emlak</Text>
                            <Text style={styles.buttonSubtitleText}>Konut, İş Yeri, Arsa, Konut Projeleri, Bina,...</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoryWrapper}>
                    {/* Araba Butonu */}
                    <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => navigation.navigate('CarList')}
                    >
                        <View style={{backgroundColor: 'red', borderRadius: '50%', padding: 10}}>
                            <MaterialCommunityIcons name="steering" size={24} color="white" />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.buttonTitleText}>Araba</Text>
                            <Text style={styles.buttonSubtitleText}>Otomobil, Arazi, SUV & Pickup, Elektrikli...</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, padding: 20, backgroundColor: '#fff'},
    searchBar: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#D3D3D3',
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    categoriesContainer: { flexDirection: 'column', marginTop: 10},
    categoryWrapper: {
        marginBottom: 5, // her buton arasına boşluk
    },
    categoryButton: {
        paddingVertical: 20,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textContainer: {
        flexDirection: "column",
        marginLeft: 12,
    },
    buttonTitleText: { 
        fontSize: 18, 
        fontWeight: '600', 
    },
    buttonSubtitleText: {
        fontSize: 12,
        color: "gray",
        marginTop: 2,
    },
});