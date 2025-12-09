import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ListingWithData } from "../lib/database/listing";

type Props = {
  listing: ListingWithData;
  onPress?: () => void;
};

const DEFAULT_IMAGE = "https://placehold.co/300x300/png";

export default function ListingItem({ listing, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: listing.image_url ?? DEFAULT_IMAGE }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>

        {listing.title && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {listing.title}
          </Text>
        )}

        {listing.price && (
          <Text style={styles.price}>
            {listing.price.toLocaleString("tr-TR")} ₺
          </Text>
        )}

        {listing.creation_date && (
          <Text style={styles.subtitle} numberOfLines={3}>
            {listing.creation_date}
          </Text>
        )}

        {listing.location_province && (
          <Text style={styles.subtitle} numberOfLines={4}>
            {listing.location_province}
          </Text>
        )}

        {listing.location_district && (
          <Text style={styles.subtitle} numberOfLines={5}>
            {listing.location_district}
          </Text>
        )}
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
    alignItems: "center",
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
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e90ff",
  },
});
