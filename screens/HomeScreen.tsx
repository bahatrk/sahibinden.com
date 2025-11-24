import React from "react";
import { View, Text, StyleSheet, TextInput,TouchableOpacity} from "react-native";
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
                placeholder="Araba, ev, eşya ara..."
            />

            {/* Kategoriler Başlığı */}
            <Text style={styles.title}>Kategoriler</Text>

            <View style={styles.categories}>
                {/* Araba Butonu */}
                <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => navigation.navigate('CarList')}
                >
                <Text style={styles.buttonText}>🚗 Araba</Text>
                </TouchableOpacity>

                {/* Emlak Butonu */}
                <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => navigation.navigate('RealEstateList')}
                >
                <Text style={styles.buttonText}>🏠 Emlak</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1,justifyContent: 'center',alignItems: 'center'},
    searchBar: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    categories: { flexDirection: 'row', justifyContent: 'space-between' },
    categoryButton: {
        backgroundColor: '#ffcc00',
        paddingVertical: 20,
        width: '48%',
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: { fontSize: 18, fontWeight: '600' },
});