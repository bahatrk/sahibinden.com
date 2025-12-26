import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import LocationPicker, { LocationResult } from "../create/LocationPicker";

// --- TYPES ---
export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MapLocationResult = {
  location: LocationResult; 
  coor: {
    lat: string;
    lon: string;
  };
};

export type InitialLocation = {
  city_id: number;
  district_id: number;
  neighbourhood_id: number;
  lat?: string;
  lon?: string;
};

type Props = {
  mode: "edit" | "view";
  initialCoordinate?: Coordinate; 
  viewTitle?: string;
  initialLocation?: InitialLocation | null; 
  onLocationSelect?: (result: MapLocationResult) => void;
};

export default function UniversalMap({ 
  mode, 
  initialCoordinate, 
  viewTitle, 
  initialLocation, 
  onLocationSelect 
}: Props) {
  
  const [locationInfo, setLocationInfo] = useState<LocationResult | null>(null);

  // Keep track of the last emitted coordinate to prevent duplicate/micro updates
  const lastEmittedCoord = useRef<{ lat: number; lon: number } | null>(null);

  // 1. Initialize Region
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.lat 
      ? parseFloat(initialLocation.lat) 
      : (initialCoordinate?.latitude || 39.925533),
    longitude: initialLocation?.lon 
      ? parseFloat(initialLocation.lon) 
      : (initialCoordinate?.longitude || 32.866287),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // 2. View Mode Update Logic
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

  // --- HANDLERS ---

  // A. Triggered when the DROPDOWN changes
  const handleDropdownSelect = (loc: LocationResult) => {
    setLocationInfo(loc);
    
    // Immediately notify parent using the CURRENT region
    // This fixes the issue where data wouldn't save until you touched the map
    if (onLocationSelect) {
      onLocationSelect({
        location: loc,
        coor: {
          lat: String(region.latitude),
          lon: String(region.longitude),
        },
      });
    }
  };

  // B. Triggered when the MAP is dragged
  const onRegionChangeComplete = (newRegion: Region) => {
    if (mode !== "edit") return;

    setRegion(newRegion);
    
    // 1. Safety Check: Do we have dropdown info yet?
    if (!locationInfo || !onLocationSelect) return;

    // 2. Anti-Chatter Check (The Fix for "Too Many Updates")
    // Only fire if moved more than ~10 meters (0.0001 degrees)
    const prev = lastEmittedCoord.current;
    if (prev) {
        const deltaLat = Math.abs(prev.lat - newRegion.latitude);
        const deltaLon = Math.abs(prev.lon - newRegion.longitude);
        if (deltaLat < 0.0001 && deltaLon < 0.0001) {
            return; // Ignore micro-movements
        }
    }

    // Update the Ref
    lastEmittedCoord.current = { lat: newRegion.latitude, lon: newRegion.longitude };

    // Fire Event
    onLocationSelect({
      location: locationInfo,
      coor: {
        lat: String(newRegion.latitude),
        lon: String(newRegion.longitude),
      },
    });
  };

  return (
    <View style={styles.container}>
      
      {/* --- EDIT MODE: LOCATION PICKER --- */}
      {mode === "edit" && (
        <View style={{ marginBottom: 10 }}>
          <LocationPicker 
            // [!] Use the specific handler here
            onSelect={handleDropdownSelect} 
            initialValues={initialLocation} 
          />
          
          {locationInfo && (
            <Text style={styles.infoText}>
              {locationInfo.cityName} - {locationInfo.districtName}
            </Text>
          )}
        </View>
      )}

      {/* --- MAP AREA --- */}
      {(mode === "view" || (mode === "edit" && (locationInfo || initialLocation))) && (
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            region={region} 
            // [!] Use the debounced handler
            onRegionChangeComplete={onRegionChangeComplete}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {mode === "view" && (
              <Marker 
                coordinate={region} 
                title={viewTitle || "Konum"}
              />
            )}
          </MapView>

          {/* Center Pin for Edit Mode */}
          {mode === "edit" && (
            <View style={styles.centerMarkerContainer} pointerEvents="none">
              <View style={styles.markerDot} />
              <View style={styles.markerStick} />
            </View>
          )}

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
  container: { flex: 1, zIndex: 3000 },
  infoText: { marginVertical: 6, fontWeight: "bold", color: "#333" },
  mapWrapper: {
    width: Dimensions.get("window").width - 24,
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    position: "relative",
    alignSelf: "center",
  },
  map: { width: "100%", height: "100%" },
  centerMarkerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginBottom: 30,
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
  overlayLabel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 8,
    alignItems: "center",
  },
  labelText: { fontSize: 12, fontWeight: "600", color: "#333" },
});