import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview"; 
import LocationPicker, { LocationResult } from "../create/LocationPicker";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MapLocationResult = {
  location: LocationResult; 
  coor: { lat: string; lon: string; };
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
  const lastEmittedCoord = useRef<{ lat: number; lon: number } | null>(null);

  // 1. Initialize Region
  const [region, setRegion] = useState({
    latitude: initialLocation?.lat 
      ? parseFloat(initialLocation.lat) 
      : (initialCoordinate?.latitude || 39.925533),
    longitude: initialLocation?.lon 
      ? parseFloat(initialLocation.lon) 
      : (initialCoordinate?.longitude || 32.866287),
  });

  // 2. View Mode Update Logic
  useEffect(() => {
    if (mode === "view" && initialCoordinate) {
      setRegion({
        latitude: initialCoordinate.latitude,
        longitude: initialCoordinate.longitude,
      });
    }
  }, [initialCoordinate, mode]);

  // --- HANDLERS ---
  const handleDropdownSelect = (loc: LocationResult) => {
    setLocationInfo(loc);
    if (onLocationSelect) {
      onLocationSelect({
        location: loc,
        coor: { lat: String(region.latitude), lon: String(region.longitude) },
      });
    }
  };

  const handleWebViewMessage = (event: any) => {
    // SECURITY: Strictly ignore updates if not in EDIT mode
    if (mode !== "edit") return;

    try {
        const data = JSON.parse(event.nativeEvent.data);
        const newLat = data.lat;
        const newLon = data.lng;

        if (!locationInfo || !onLocationSelect) return;

        // Anti-Chatter Check
        const prev = lastEmittedCoord.current;
        if (prev) {
            const deltaLat = Math.abs(prev.lat - newLat);
            const deltaLon = Math.abs(prev.lon - newLon);
            if (deltaLat < 0.0001 && deltaLon < 0.0001) return; 
        }

        lastEmittedCoord.current = { lat: newLat, lon: newLon };
        
        onLocationSelect({
            location: locationInfo,
            coor: { lat: String(newLat), lon: String(newLon) },
        });
    } catch (e) {
        console.error("Map parse error", e);
    }
  };

  // --- HTML GENERATOR ---
  const getMapHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map', { zoomControl: true }).setView([${region.latitude}, ${region.longitude}], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: 'OpenStreetMap'
            }).addTo(map);

            // --- VIEW MODE LOGIC ---
            if ("${mode}" === "view") {
                // 1. Add a REAL marker at the specific location
                // This marker stays at that Lat/Lon even if you drag the map away.
                L.marker([${region.latitude}, ${region.longitude}]).addTo(map);
                
                // 2. Do NOT add any listeners for movement.
                // The user can drag the map, but the marker stays geographically fixed.
            }

            // --- EDIT MODE LOGIC ---
            if ("${mode}" === "edit") {
                // 1. We do NOT add a marker here.
                // React Native renders the Red Pin Overlay in the center of the screen.

                // 2. Listen for movements to update the center coordinate
                map.on('moveend', function() {
                    var center = map.getCenter();
                    window.ReactNativeWebView.postMessage(JSON.stringify({ lat: center.lat, lng: center.lng }));
                });
            }
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      
      {mode === "edit" && (
        <View style={{ marginBottom: 10 }}>
          <LocationPicker 
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

      {(mode === "view" || (mode === "edit" && (locationInfo || initialLocation))) && (
        <View style={styles.mapWrapper}>
          <WebView
             // Key forces a full reload if the coordinate changes drastically (like opening a new listing)
             key={`${initialCoordinate?.latitude}-${initialCoordinate?.longitude}`}
             originWhitelist={['*']}
             source={{ html: getMapHtml() }}
             style={styles.map}
             onMessage={handleWebViewMessage}
             javaScriptEnabled={true}
             scrollEnabled={false} 
             renderLoading={() => <ActivityIndicator style={{position:'absolute', top:'50%', left:'50%'}} color="#2E5894" />}
             startInLoadingState={true}
          />

          {/* EDIT MODE OVERLAY (The Red Pin stuck to screen center) */}
          {mode === "edit" && (
            <View style={styles.centerMarkerContainer} pointerEvents="none">
              <View style={styles.markerDot} />
              <View style={styles.markerStick} />
            </View>
          )}

          {/* Label at bottom */}
          <View style={styles.overlayLabel}>
            <Text style={styles.labelText}>
              {mode === "edit" ? "Scroll the map to determine your location." : viewTitle || "Listing Location"}
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
    backgroundColor: '#f5f5f5'
  },
  map: { width: "100%", height: "100%" },
  
  // Custom Pin Styles (Only used in Edit Mode)
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