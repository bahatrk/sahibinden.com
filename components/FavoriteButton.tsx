import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import {
  addFavoriteApi,
  isFavoriteApi,
  removeFavoriteApi,
} from "../lib/api/favorite";

type Props = {
  listingId: number;
  userId: number;
  size?: number;
  onToggle?: (removed: boolean) => void; // removed = true -> favoriden çıkarıldı
};

export default function FavoriteButton({
  listingId,
  userId,
  size = 26,
  onToggle,
}: Props) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect içinde async IIFE kullanıyoruz
  useEffect(() => {
    if (!userId || !listingId) return; // cökmeyi önlemke icin

    (async () => {
      try {
        const fav = await isFavoriteApi(userId, listingId);
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
        await removeFavoriteApi(userId, listingId);
        onToggle?.(true);
        setFavorite(false);
      } else {
        await addFavoriteApi(userId, listingId);
        onToggle?.(false);
        setFavorite(true);
      }
      setFavorite(!favorite);
    } catch (err) {
      console.error("FavoriteButton toggle error:", err);
    }
  };

  if (loading) return null;

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Text style={{ fontSize: size }}>{favorite ? "❤️" : "🤍"}</Text>
    </TouchableOpacity>
  );
}
