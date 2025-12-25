import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  fetchAllProvinces,
  fetchNeigborhoodByDistricts,
  fetchDistrictsByProvinceId,
} from "../../lib/api/location";

export type LocationResult = {
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  neighbourhoodId?: number;
  neighbourhoodName?: string;
};

type Props = {
  onSelect: (location: LocationResult) => void;
};

export default function LocationPicker({ onSelect }: Props) {
  // --- STATE TANIMLARI ---
  const [cities, setCities] = useState<{ label: string; value: number }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; value: number }[]>([]);
  const [neighbourhoods, setNeighbourhoods] = useState<{ label: string; value: number }[]>([]);

  // Dropdown Açık/Kapalı Durumları
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [neighbourhoodOpen, setNeighbourhoodOpen] = useState(false);

  // Seçili Değerler
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<number | null>(null);

  // Sonsuz döngüyü engellemek için son gönderilen veriyi tutar
  const lastEmittedRef = useRef<string>("");

  // --- VERİ YÜKLEME ---

  // 1. Şehirleri Yükle (Sadece bir kere çalışır)
  useEffect(() => {
    let mounted = true;
    fetchAllProvinces().then((res) => {
      if (mounted) setCities(res.map((c) => ({ label: c.name, value: c.id })));
    });
    return () => { mounted = false; };
  }, []);

  // 2. Şehir Değişince -> İlçeleri Yükle
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }
    
    // Şehir değiştiyse alt seçimleri sıfırla!
    setSelectedDistrict(null);
    setSelectedNeighbourhood(null);
    setNeighbourhoods([]);

    fetchDistrictsByProvinceId(selectedCity).then((res) => {
      setDistricts(res.map((d) => ({ label: d.name, value: d.id })));
    });
  }, [selectedCity]);

  // 3. İlçe Değişince -> Mahalleleri Yükle
  useEffect(() => {
    if (!selectedDistrict) {
      setNeighbourhoods([]);
      return;
    }

    // İlçe değiştiyse mahalleyi sıfırla!
    setSelectedNeighbourhood(null);

    fetchNeigborhoodByDistricts(selectedDistrict).then((res) => {
      setNeighbourhoods(res.map((n) => ({ label: n.name + '-'+ n.area_name, value: n.id })));
    });
  }, [selectedDistrict]);

  // --- ÜST BİLEŞENE HABER VERME ---
  useEffect(() => {
    // Sadece Şehir ve İlçe seçiliyse haber ver (Mahalle opsiyonel olabilir veya zorunluysa buraya ekleyin)
    if (selectedCity && selectedDistrict && selectedNeighbourhood) {
      const cityName = cities.find((c) => c.value === selectedCity)?.label || "";
      const districtName = districts.find((d) => d.value === selectedDistrict)?.label || "";
      const neighbourhoodName = selectedNeighbourhood
        ? neighbourhoods.find((n) => n.value === selectedNeighbourhood)?.label
        : undefined;

      const result: LocationResult = {
        cityId: selectedCity,
        cityName,
        districtId: selectedDistrict,
        districtName,
        neighbourhoodId: selectedNeighbourhood ?? undefined,
        neighbourhoodName,
      };

      // 🛑 KRİTİK KONTROL: Eğer veri değişmediyse `onSelect`i çağırma!
      // Bu sonsuz döngüyü ve API re-trigger sorununu engeller.
      const resultString = JSON.stringify(result);
      if (lastEmittedRef.current !== resultString) {
        lastEmittedRef.current = resultString;
        onSelect(result);
      }
    }
  }, [selectedCity, selectedDistrict, selectedNeighbourhood]);

  // Dropdown'ların çakışmaması için birini açınca diğerlerini kapatan yardımcı fonksiyon
  const onOpenCity = () => { setDistrictOpen(false); setNeighbourhoodOpen(false); };
  const onOpenDistrict = () => { setCityOpen(false); setNeighbourhoodOpen(false); };
  const onOpenNeighbourhood = () => { setCityOpen(false); setDistrictOpen(false); };

  return (
    <View style={{ marginBottom: 20, zIndex: 3000 }}>
      
      {/* --- CITY --- */}
      <View style={{ zIndex: 3000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>Şehir</Text>
        <DropDownPicker
          open={cityOpen}
          value={selectedCity}
          items={cities}
          setOpen={setCityOpen}
          setValue={setSelectedCity}
          onOpen={onOpenCity}
          placeholder="Şehir seçiniz"
          searchable={true}
          searchPlaceholder="Şehir ara..."
          
          // Z-INDEX FIX
          zIndex={3000}
          zIndexInverse={1000}

          // MODAL STYLING
          listMode="MODAL"
          modalTitle="Şehir Seçin"
          modalProps={{ animationType: "slide" }}
          modalContentContainerStyle={{
            marginTop: "30%", // Leaves top 30% of screen empty
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
          }}
        />
      </View>

      {/* --- DISTRICT --- */}
      <View style={{ marginTop: 15, zIndex: 2000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>İlçe</Text>
        <DropDownPicker
          open={districtOpen}
          value={selectedDistrict}
          items={districts}
          setOpen={setDistrictOpen}
          setValue={setSelectedDistrict}
          onOpen={onOpenDistrict}
          placeholder={selectedCity ? "İlçe seçiniz" : "Önce şehir seçiniz"}
          disabled={!selectedCity}
          searchable={true}
          searchPlaceholder="İlçe ara..."
          style={{ opacity: !selectedCity ? 0.5 : 1 }}

          // Z-INDEX FIX
          zIndex={2000}
          zIndexInverse={2000}

          // MODAL STYLING
          listMode="MODAL"
          modalTitle="İlçe Seçin"
          modalProps={{ animationType: "slide" }}
          modalContentContainerStyle={{
            marginTop: "30%", 
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
          }}
        />
      </View>

      {/* --- NEIGHBOURHOOD --- */}
      <View style={{ marginTop: 15, zIndex: 1000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>Mahalle</Text>
        <DropDownPicker
          open={neighbourhoodOpen}
          value={selectedNeighbourhood}
          items={neighbourhoods}
          setOpen={setNeighbourhoodOpen}
          setValue={setSelectedNeighbourhood}
          onOpen={onOpenNeighbourhood}
          placeholder={selectedDistrict ? "Mahalle seçiniz" : "Önce ilçe seçiniz"}
          disabled={!selectedDistrict}
          searchable={true}
          searchPlaceholder="Mahalle ara..."
          style={{ opacity: !selectedDistrict ? 0.5 : 1 }}

          // Z-INDEX FIX
          zIndex={1000}
          zIndexInverse={3000}

          // MODAL STYLING
          listMode="MODAL"
          modalTitle="Mahalle Seçin"
          modalProps={{ animationType: "slide" }}
          modalContentContainerStyle={{
            marginTop: "30%", 
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#fff",
          }}
        />
      </View>
    </View>
);
}