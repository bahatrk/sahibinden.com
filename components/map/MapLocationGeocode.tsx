import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview"; 
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
  
  // Default coordinates (Ankara)
  const [coords, setCoords] = useState({
    latitude: 39.925533,
    longitude: 32.866287,
  });

  // 1. Update Parent when coordinates change
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

  // 2. Handle Messages (Drag OR Click)
  const handleWebViewMessage = (event: any) => {
    try {
        const data = JSON.parse(event.nativeEvent.data);
        // We handle 'dragend' and 'click' the same way: Update state
        if (data.type === 'update_coords') {
            setCoords({
                latitude: data.lat,
                longitude: data.lng
            });
        }
    } catch (e) {
        console.error("Map message error", e);
    }
  };

  // 3. HTML Content
  const mapHtml = `
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
            // Initialize Map
            var map = L.map('map').setView([${coords.latitude}, ${coords.longitude}], 13);

            // Add OpenStreetMap Tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'OpenStreetMap',
                maxZoom: 19
            }).addTo(map);

            // Add Draggable Marker
            var marker = L.marker([${coords.latitude}, ${coords.longitude}], {draggable: true}).addTo(map);

            // --- HELPER FUNCTION TO SEND DATA ---
            function sendUpdate(lat, lng) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'update_coords',
                    lat: lat,
                    lng: lng
                }));
            }

            // --- EVENT 1: DRAG END ---
            marker.on('dragend', function(event) {
                var position = marker.getLatLng();
                sendUpdate(position.lat, position.lng);
            });

            // --- EVENT 2: MAP CLICK (Move Pin to Click) ---
            map.on('click', function(e) {
                marker.setLatLng(e.latlng); // Move marker visually
                sendUpdate(e.latlng.lat, e.latlng.lng); // Send data
            });
        </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, zIndex: 3000 }}>
      <LocationPicker onSelect={(loc) => {
          setLocation(loc);
          // If the location object has lat/lon, you might want to update coords here too
      }} />
      
      {location && (
        <View style={styles.mapContainer}>
           <WebView
              key={`${coords.latitude}-${coords.longitude}`} // Force re-render if needed on major changes
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={styles.map}
              scrollEnabled={false}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <ActivityIndicator style={styles.loading} color="#2E5894" />}
           />

           <View style={styles.hintBubble}>
             <Text style={styles.hintText}>Drag the pin or click on the map.</Text>
           </View>
        </View>
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
    backgroundColor: '#f0f0f0'
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1
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