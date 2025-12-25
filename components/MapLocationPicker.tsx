import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import LocationPicker, { LocationResult } from "./create/LocationPicker";

export type MapLocationResult = {
  location: LocationResult,
  coor: {
    lat: string,
    lon: string
  }
};

type Props = {
  onLocationSelect: (mapLocation: MapLocationResult) => void;
};

export default function MapLocationPicker({ onLocationSelect }: Props) {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [coords, setCoords] = useState({ lat: 39.925533, lng: 32.866287 }); // default Ankara

  // Notify parent when location changes
  useEffect(() => {
    if (location) {
      onLocationSelect({ location:location,coor:{  lat: String(coords.lat), lon: String(coords.lng)} });
    }
  }, [location, coords]);

  // HTML for Leaflet map
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"
        />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${coords.lat}, ${coords.lng}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          var marker = L.marker([${coords.lat}, ${coords.lng}], { draggable: true }).addTo(map);
          marker.on('dragend', function(e) {
            const pos = marker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat, lng: pos.lng }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, zIndex: 3000 }}>
      <LocationPicker onSelect={setLocation} />
      {location && (
        <>
          <Text style={{ marginVertical: 6 }}>
            {location.cityName} - {location.districtName}{" "}
            {location.neighbourhoodName ? `- ${location.neighbourhoodName}` : ""}
          </Text>
          <WebView
            originWhitelist={["*"]}
            source={{ html }}
            style={styles.map}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              setCoords(data);
              onLocationSelect({ location:location,coor:{  lat: String(data.lat), lon: String(data.lng)} });
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width - 24,
    height: 300,
    marginVertical: 10,
  },
});
