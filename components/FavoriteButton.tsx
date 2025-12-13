import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../lib/database/favorite";

type Props = {
  listingId: number;
  userId: number;
  size?: number;
};

export default function FavoriteButton({
  listingId,
  userId,
  size = 26,
}: Props) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect içinde async IIFE kullanıyoruz
  useEffect(() => {
    (async () => {
      try {
        const fav = await isFavorite(userId, listingId);
        setFavorite(fav);
      } catch (err) {
        console.error("FavoriteButton check error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId, userId]);

  // toggle fonksiyonu
  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await removeFavorite(userId, listingId);
      } else {
        await addFavorite(userId, listingId);
      }
      setFavorite(!favorite);
    } catch (err) {
      console.error("FavoriteButton toggle error:", err);
    }
  };

  if (loading) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Text style={{ fontSize: size }}>
        {favorite ? "❤️" : "🤍"}
      </Text>
    </TouchableOpacity>
  );
}
