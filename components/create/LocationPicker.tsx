import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  fetchAllProvinces,
  fetchProvinceIdDistricts,
  fetchNeigborhoodByDistricts,
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
  const [cities, setCities] = useState<{ label: string; value: number }[]>([]);
  const [districts, setDistricts] = useState<
    { label: string; value: number }[]
  >([]);
  const [neighbourhoods, setNeighbourhoods] = useState<
    { label: string; value: number }[]
  >([]);

  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [neighbourhoodOpen, setNeighbourhoodOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    number | null
  >(null);

  // 🔹 Load cities
  useEffect(() => {
    (async () => {
      const res = await fetchAllProvinces();
      setCities(res.map((c) => ({ label: c.name, value: c.id })));
    })();
  }, []);

  // 🔹 Load districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      setSelectedDistrict(null);
      return;
    }
    (async () => {
      const res = await fetchProvinceIdDistricts(selectedCity);
      setDistricts(res.map((d) => ({ label: d.name, value: d.id })));
      setNeighbourhoods([]);
      setSelectedNeighbourhood(null);
    })();
  }, [selectedCity]);

  // 🔹 Load neighbourhoods when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setNeighbourhoods([]);
      setSelectedNeighbourhood(null);
      return;
    }
    (async () => {
      const res = await fetchNeigborhoodByDistricts(selectedDistrict);
      setNeighbourhoods(res.map((n) => ({ label: n.name, value: n.id })));
    })();
  }, [selectedDistrict]);

  // 🔹 Notify parent when selection is complete
  useEffect(() => {
    if (selectedCity && selectedDistrict) {
      const cityName =
        cities.find((c) => c.value === selectedCity)?.label || "";
      const districtName =
        districts.find((d) => d.value === selectedDistrict)?.label || "";
      const neighbourhoodName = selectedNeighbourhood
        ? neighbourhoods.find((n) => n.value === selectedNeighbourhood)?.label
        : undefined;

      onSelect({
        cityId: selectedCity,
        cityName,
        districtId: selectedDistrict,
        districtName,
        neighbourhoodId: selectedNeighbourhood ?? undefined,
        neighbourhoodName,
      });
    }
  }, [selectedCity, selectedDistrict, selectedNeighbourhood]);

  return (
    <View style={{ zIndex: 3000, marginBottom: 20 }}>
      <Text>Şehir</Text>
      <DropDownPicker
        open={cityOpen}
        value={selectedCity}
        items={cities}
        setOpen={setCityOpen}
        setValue={setSelectedCity}
        placeholder="Şehir seç"
        zIndex={3000}
        dropDownContainerStyle={{ zIndex: 3000 }}
        listMode="SCROLLVIEW" // <--- BU SATIRI EKLEYİN
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />

      <Text style={{ marginTop: 10 }}>İlçe</Text>
      <DropDownPicker
        open={districtOpen}
        value={selectedDistrict}
        items={districts}
        setOpen={setDistrictOpen}
        setValue={setSelectedDistrict}
        placeholder="İlçe seç"
        disabled={!selectedCity}
        zIndex={2000}
        dropDownContainerStyle={{ zIndex: 2000 }}
        listMode="SCROLLVIEW" // <--- BU SATIRI EKLEYİN
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />

      <Text style={{ marginTop: 10 }}>Mahalle (Opsiyonel)</Text>
      <DropDownPicker
        open={neighbourhoodOpen}
        value={selectedNeighbourhood}
        items={neighbourhoods}
        setOpen={setNeighbourhoodOpen}
        setValue={setSelectedNeighbourhood}
        placeholder="Mahalle seç"
        disabled={!selectedDistrict}
        zIndex={1000}
        dropDownContainerStyle={{ zIndex: 1000 }}
        listMode="SCROLLVIEW" // <--- BU SATIRI EKLEYİN
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  );
}
