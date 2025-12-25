import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Sadece MapView ve Marker import edildi
import LocationPicker, { LocationResult } from "../create/LocationPicker";

export type MapLocationResult = {
  location: LocationResult;
  coor: {
    lat: string;
    lon: string;
  };
};

type Props = {
  onLocationSelect: (mapLocation: MapLocationResult) => void;
};

export default function MapLocationPicker({ onLocationSelect }: Props) {
  const [location, setLocation] = useState<LocationResult | null>(null);

  // Varsayılan koordinat (Ankara)
  const [coords, setCoords] = useState({
    latitude: 39.925533,
    longitude: 32.866287,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (location) {
      onLocationSelect({
        location: location,
        coor: {
          lat: String(coords.latitude),
          lon: String(coords.longitude),
        },
      });
    }
  }, [location, coords]);

  // ÇÖZÜM: Event tipini manuel olarak tanımlıyoruz.
  // Bu sayede kütüphaneden import etmeye gerek kalmıyor.
  const handleDragEnd = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoords((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  return (
    <View style={{ flex: 1, zIndex: 3000 }}>
      {/* Şehir/İlçe Seçici */}
      <LocationPicker onSelect={setLocation} />
      
      {location && (
        <>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={coords} 
              // Kullanıcı haritayı kaydırdığında merkezi güncellemek istersen:
              onRegionChangeComplete={(region) => setCoords(region)}
            >
              <Marker
                draggable
                coordinate={coords}
                title="Seçilen Konum"
                onDragEnd={handleDragEnd}
              />
            </MapView>
            
            <View style={styles.hintBubble}>
              <Text style={styles.hintText}>Konumu değiştirmek için pini sürükleyin</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: Dimensions.get("window").width - 24,
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    borderColor: '#ddd',
    borderWidth: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  hintBubble: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  hintText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600"
  }
});