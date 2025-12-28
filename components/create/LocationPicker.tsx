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

// Define the shape of the incoming location object
type InitialLocation = {
  city_id: number;
  district_id: number;
  neighbourhood_id: number;
  lat?: string;
  lon?: string;
};

type Props = {
  onSelect: (location: LocationResult) => void;
  // New Prop for Edit Mode
  initialValues?: InitialLocation | null; 
};

export default function LocationPicker({ onSelect, initialValues }: Props) {
  // --- STATE DEFINITIONS ---
  const [cities, setCities] = useState<{ label: string; value: number }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; value: number }[]>([]);
  const [neighbourhoods, setNeighbourhoods] = useState<{ label: string; value: number }[]>([]);

  // Dropdown Open States
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [neighbourhoodOpen, setNeighbourhoodOpen] = useState(false);

  // Selected Values
  // 1. Initialize City immediately if initialValues exists
  const [selectedCity, setSelectedCity] = useState<number | null>(
    initialValues?.city_id || null
  );
  
  // District and Neighbourhood must start null, they will be filled by the useEffect chain
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<number | null>(null);

  const lastEmittedRef = useRef<string>("");

  // --- DATA LOADING ---

  // 1. Load Cities
  useEffect(() => {
    let mounted = true;
    fetchAllProvinces().then((res) => {
      if (mounted) setCities(res.map((c) => ({ label: c.name, value: c.id })));
    });
    return () => { mounted = false; };
  }, []);

  // 2. City Changed -> Load Districts
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }
    
    // Reset children if the user manually changes the city
    // But if we are in the initialization phase, we might want to keep logic flow
    const isInitializing = initialValues && initialValues.city_id === selectedCity;

    if (!isInitializing) {
        setSelectedDistrict(null);
        setSelectedNeighbourhood(null);
        setNeighbourhoods([]);
    }

    fetchDistrictsByProvinceId(selectedCity).then((res) => {
      setDistricts(res.map((d) => ({ label: d.name, value: d.id })));

      // AUTO-SELECT DISTRICT
      // If we have initial values AND the currently selected city matches the initial city
      if (initialValues && initialValues.city_id === selectedCity) {
          setSelectedDistrict(initialValues.district_id);
      }
    });
  }, [selectedCity]);

  // 3. District Changed -> Load Neighbourhoods
  useEffect(() => {
    if (!selectedDistrict) {
      setNeighbourhoods([]);
      return;
    }

    // Reset neighbourhood if user manually changes district
    const isInitializing = initialValues && initialValues.district_id === selectedDistrict;
    
    if (!isInitializing) {
        setSelectedNeighbourhood(null);
    }

    fetchNeigborhoodByDistricts(selectedDistrict).then((res) => {
      setNeighbourhoods(res.map((n) => ({ label: n.name + ' - ' + n.area_name, value: n.id })));

      // AUTO-SELECT NEIGHBOURHOOD
      // If we have initial values AND the currently selected district matches the initial district
      if (initialValues && initialValues.district_id === selectedDistrict) {
          setSelectedNeighbourhood(initialValues.neighbourhood_id);
      }
    });
  }, [selectedDistrict]);

  // --- NOTIFY PARENT ---
  useEffect(() => {
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

      const resultString = JSON.stringify(result);
      if (lastEmittedRef.current !== resultString) {
        lastEmittedRef.current = resultString;
        onSelect(result);
      }
    }
  }, [selectedCity, selectedDistrict, selectedNeighbourhood, cities, districts, neighbourhoods]);

  // UI Helpers
  const onOpenCity = () => { setDistrictOpen(false); setNeighbourhoodOpen(false); };
  const onOpenDistrict = () => { setCityOpen(false); setNeighbourhoodOpen(false); };
  const onOpenNeighbourhood = () => { setCityOpen(false); setDistrictOpen(false); };

  return (
    <View style={{ marginBottom: 20, zIndex: 3000 }}>
      
      {/* --- CITY --- */}
      <View style={{ zIndex: 3000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>City</Text>
        <DropDownPicker
          open={cityOpen}
          value={selectedCity}
          items={cities}
          setOpen={setCityOpen}
          setValue={setSelectedCity}
          onOpen={onOpenCity}
          placeholder="Select city"
          searchable={true}
          searchPlaceholder="Search city..."
          zIndex={3000}
          zIndexInverse={1000}
          listMode="MODAL"
          modalTitle="Select City"
        />
      </View>

      {/* --- DISTRICT --- */}
      <View style={{ marginTop: 15, zIndex: 2000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>District</Text>
        <DropDownPicker
          open={districtOpen}
          value={selectedDistrict}
          items={districts}
          setOpen={setDistrictOpen}
          setValue={setSelectedDistrict}
          onOpen={onOpenDistrict}
          placeholder={selectedCity ? "Select district" : "Select city first"}
          disabled={!selectedCity}
          searchable={true}
          searchPlaceholder="Search district..."
          style={{ opacity: !selectedCity ? 0.5 : 1 }}
          zIndex={2000}
          zIndexInverse={2000}
          listMode="MODAL"
          modalTitle="Select District"
        />
      </View>

      {/* --- NEIGHBOURHOOD --- */}
      <View style={{ marginTop: 15, zIndex: 1000 }}>
        <Text style={{ marginBottom: 5, fontWeight: '600' }}>Neighbourhood</Text>
        <DropDownPicker
          open={neighbourhoodOpen}
          value={selectedNeighbourhood}
          items={neighbourhoods}
          setOpen={setNeighbourhoodOpen}
          setValue={setSelectedNeighbourhood}
          onOpen={onOpenNeighbourhood}
          placeholder={selectedDistrict ? "Select neighborhood" : "First select the district"}
          disabled={!selectedDistrict}
          searchable={true}
          searchPlaceholder="Search the neighborhood..."
          style={{ opacity: !selectedDistrict ? 0.5 : 1 }}
          zIndex={1000}
          zIndexInverse={3000}
          listMode="MODAL"
          modalTitle="Select Neighborhood"
        />
      </View>
    </View>
  );
}