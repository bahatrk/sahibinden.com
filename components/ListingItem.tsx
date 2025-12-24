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
      <Image
        source={{
          uri: listing.image_url
            ? getImageUrl(listing.image_url)
            : DEFAULT_IMAGE,
        }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.title}>{listing.title}</Text>

        {/* Location + Price Row */}
        <View style={styles.row}>
          <View style={styles.locationContainer}>
            {listing.location_province && (
              <Text style={styles.subtitle}>{listing.location_province},</Text>
            )}
            {listing.location_district && (
              <Text style={styles.subtitle}>{listing.location_district}</Text>
            )}
          </View>

          {listing.price && (
            <Text style={styles.price}>
              {listing.price.toLocaleString("tr-TR")} TL
            </Text>
          )}
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
    alignItems: "flex-start",
    gap: 12,
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
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    flexShrink: 1, // title uzunsa alt satıra geçer
    flexWrap: "wrap", // satır taşarsa wrap
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationContainer: {
    flexDirection: "row",
    flexShrink: 1, // location uzun olursa price taşmaz
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e90ff",
  },
});
