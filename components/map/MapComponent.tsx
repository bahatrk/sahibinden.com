import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import LocationPicker, { LocationResult } from "../create/LocationPicker";
// Senin mevcut LocationPicker bileşenin (Dropdownlar)

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MapLocationResult = {
  location: LocationResult; // Şehir, ilçe adları
  coor: {
    lat: string;
    lon: string;
  };
};

type Props = {
  // 'edit' -> Konum seçme modu (Uber tarzı sabit orta pin)
  // 'view' -> Sadece gösterme modu (Normal pin)
  mode: "edit" | "view";
  
  // 'view' modu için gerekli başlangıç koordinatı
  initialCoordinate?: Coordinate;
  
  // 'view' modu için opsiyonel başlık (Örn: "Ankara / Çankaya")
  viewTitle?: string;

  // 'edit' modunda seçim yapıldığında çalışır
  onLocationSelect?: (result: MapLocationResult) => void;
};

export default function UniversalMap({ mode, initialCoordinate, viewTitle, onLocationSelect }: Props) {
  const [locationInfo, setLocationInfo] = useState<LocationResult | null>(null);

  // Varsayılan bölge (Ankara) veya dışarıdan gelen initialCoordinate
  const [region, setRegion] = useState<Region>({
    latitude: initialCoordinate?.latitude || 39.925533,
    longitude: initialCoordinate?.longitude || 32.866287,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Eğer 'view' modundaysak ve yeni bir koordinat gelirse haritayı oraya odakla
  useEffect(() => {
    if (mode === "view" && initialCoordinate) {
      setRegion({
        latitude: initialCoordinate.latitude,
        longitude: initialCoordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [initialCoordinate, mode]);

  // Harita kaydırıldığında (Sadece Edit Modu için önemli)
  const onRegionChangeComplete = (newRegion: Region) => {
    if (mode === "edit") {
      setRegion(newRegion);
      // Eğer şehir bilgisi seçildiyse parent'a güncel koordinatı gönder
      if (locationInfo && onLocationSelect) {
        onLocationSelect({
          location: locationInfo,
          coor: {
            lat: String(newRegion.latitude),
            lon: String(newRegion.longitude),
          },
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      
      {/* --- EDIT MODE: ŞEHİR SEÇİCİ --- */}
      {mode === "edit" && (
        <View style={{ marginBottom: 10 }}>
          <LocationPicker onSelect={setLocationInfo} />
          {locationInfo && (
            <Text style={styles.infoText}>
              {locationInfo.cityName} - {locationInfo.districtName}
            </Text>
          )}
        </View>
      )}

      {/* --- HARİTA ALANI --- */}
      {(mode === "view" || (mode === "edit" && locationInfo)) && (
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            region={region} 
            // Edit modunda ise state'i güncelle, View modunda ise sadece serbest gezinti
            onRegionChangeComplete={mode === "edit" ? onRegionChangeComplete : undefined}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {/* VIEW MODE: SABİT MARKER (Normal Pin) */}
            {mode === "view" && (
              <Marker 
                coordinate={region} 
                title={viewTitle || "Konum"}
              />
            )}
          </MapView>

          {/* EDIT MODE: ORTADA SABİT HEDEF (Uber Tarzı) */}
          {mode === "edit" && (
            <View style={styles.centerMarkerContainer} pointerEvents="none">
              <View style={styles.markerDot} />
              <View style={styles.markerStick} />
            </View>
          )}

          {/* Harita Altındaki Bilgi Kutucuğu */}
          <View style={styles.overlayLabel}>
            <Text style={styles.labelText}>
              {mode === "edit" ? "Konumu belirlemek için haritayı kaydırın" : viewTitle || "İlan Konumu"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 3000,
  },
  infoText: {
    marginVertical: 6,
    fontWeight: "bold",
    color: "#333",
  },
  mapWrapper: {
    width: Dimensions.get("window").width - 24, // Kenar boşlukları için
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    position: "relative",
    alignSelf: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  // --- Sabit Pin Stilleri (Sadece Edit Modu) ---
  centerMarkerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginBottom: 30, // Pinin ucu tam ortaya gelsin diye
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EA4335",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  markerStick: {
    width: 2,
    height: 18,
    backgroundColor: "#EA4335",
    marginTop: -2,
  },
  // --- Alt Bilgi Çubuğu ---
  overlayLabel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 8,
    alignItems: "center",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});