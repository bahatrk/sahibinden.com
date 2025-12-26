import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ListingWithData } from "../lib/database/listing";
import { DEFAULT_IMAGE, getImageUrl } from "../constant/apiConfig";

type Props = {
  listing: ListingWithData;
  onPress?: () => void;
};

export default function ListingItem({ listing, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* 1. Image */}
      <Image
        source={{
          uri: listing.image_url
            ? getImageUrl(listing.image_url)
            : DEFAULT_IMAGE,
        }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* 2. Content */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        {/* Bottom Row: Location (Left) vs Price/Date (Right) */}
        <View style={styles.row}>
          
          {/* LEFT: Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.subtitle} numberOfLines={3}>
              {listing.city_name}
              {" / "}
              {listing.district_name}
              {"\n"}
              {listing.neighbourhood_name}
            </Text>
          </View>

          {/* RIGHT: Price + Time Ago */}
          <View style={styles.rightColumn}>
            {listing.price && (
              <Text style={styles.price}>
                {listing.price.toLocaleString("tr-TR")} TL
              </Text>
            )}
            
            {/* Display the 'Time Ago' string coming from SQL */}
            <Text style={styles.timeAgo}>
                {listing.creation_date}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginVertical: 6,
    marginHorizontal: 12,
    gap: 12,
    // Shadows
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },

  infoContainer: {
    flex: 1,
    justifyContent: "space-between", // Pushes title up and row down
    paddingVertical: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
    lineHeight: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Aligns text to the bottom
  },

  locationContainer: {
    flex: 1,
    marginRight: 8,
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },

  rightColumn: {
    alignItems: "flex-end", // Aligns price and date to the right
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E5894", // Sahibinden Blue
    marginBottom: 2,
  },

  timeAgo: {
    fontSize: 11,
    color: "#999", // Lighter gray for date
    fontWeight: "500",
  },
});